import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const SYSTEM_PROMPT = `You are Mentroo AI, an expert career guidance assistant.
You help students and professionals with:
- Career path recommendations across Education, Business, Sports, Medical, Engineering, Arts, Law, Government, Research
- College recommendations (Indian & international universities)
- Entrance exam guidance (JEE, NEET, IELTS, GRE, GMAT, SAT, etc.)
- Application process steps for colleges and scholarships
- Study abroad guidance (USA, UK, Canada, Australia, Germany)
- Professional career advice

Always be encouraging, specific, and data-driven. When appropriate, recommend the user book a consultation with a human expert on our platform.
Format responses clearly using bullet points and headings when helpful. Keep responses concise and actionable.`;

// POST /api/ai/chat
export const chat = async (req: Request, res: Response) => {
  const { message, sessionId, domain, history = [] } = req.body;

  try {
    const contextualPrompt = domain
      ? `${SYSTEM_PROMPT}\n\nFocus area: ${domain}. `
      : SYSTEM_PROMPT;

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: contextualPrompt }] },
        { role: 'model', parts: [{ text: "I'm Mentroo AI, ready to guide you! How can I help with your career today?" }] },
        ...history.map((h: any) => ({
          role: h.role,
          parts: [{ text: h.content }],
        })),
      ],
      generationConfig: { maxOutputTokens: 1024, temperature: 0.7 },
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    // Persist to session if user is logged in
    let updatedSessionId = sessionId;
    const userId = (req as AuthRequest).user?.id;
    if (userId && sessionId) {
      const session = await prisma.aiSession.findUnique({ where: { id: sessionId } });
      if (session) {
        const messages = session.messages as any[];
        messages.push({ role: 'user', content: message, timestamp: new Date() });
        messages.push({ role: 'model', content: responseText, timestamp: new Date() });
        await prisma.aiSession.update({ where: { id: sessionId }, data: { messages } });
      }
    } else if (userId && !sessionId) {
      const newSession = await prisma.aiSession.create({
        data: {
          userId,
          title: message.slice(0, 50),
          domain,
          messages: [
            { role: 'user', content: message, timestamp: new Date() },
            { role: 'model', content: responseText, timestamp: new Date() },
          ],
        },
      });
      updatedSessionId = newSession.id;
    }

    res.json({ success: true, data: { response: responseText, sessionId: updatedSessionId } });
  } catch (error: any) {
    throw new AppError(`AI service error: ${error.message}`, 503);
  }
};

// GET /api/ai/sessions
export const getSessions = async (req: AuthRequest, res: Response) => {
  const sessions = await prisma.aiSession.findMany({
    where: { userId: req.user!.id },
    select: { id: true, title: true, domain: true, createdAt: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
    take: 50,
  });
  res.json({ success: true, data: sessions });
};

// POST /api/ai/sessions
export const createSession = async (req: AuthRequest, res: Response) => {
  const { domain } = req.body;
  const session = await prisma.aiSession.create({
    data: { userId: req.user!.id, domain, messages: [] },
  });
  res.status(201).json({ success: true, data: session });
};

// GET /api/ai/sessions/:id
export const getSessionById = async (req: AuthRequest, res: Response) => {
  const session = await prisma.aiSession.findFirst({
    where: { id: req.params.id, userId: req.user!.id },
  });
  if (!session) throw new AppError('Session not found', 404);
  res.json({ success: true, data: session });
};

// DELETE /api/ai/sessions/:id
export const deleteSession = async (req: AuthRequest, res: Response) => {
  await prisma.aiSession.deleteMany({ where: { id: req.params.id, userId: req.user!.id } });
  res.json({ success: true, message: 'Session deleted' });
};

// POST /api/ai/analyze
export const analyzeDocument = async (req: AuthRequest, res: Response) => {
  const { fileUrl } = req.body;
  const prompt = `A student has uploaded their academic document from ${fileUrl}. Based on typical academic documents, provide generic career guidance suggestions for Indian students. Include: top career paths, recommended colleges, entrance exams to consider, and 3 actionable next steps.`;
  const result = await model.generateContent(prompt);
  res.json({ success: true, data: { analysis: result.response.text() } });
};
