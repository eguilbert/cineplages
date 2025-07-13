import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

export const requireProfile = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).json({ error: "Token manquant" });

  try {
    // Vérifier le token JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.sub;

    // Chercher le profil utilisateur
    const profile = await prisma.userProfile.findUnique({
      where: { user_id: userId },
    });

    if (!profile) {
      return res.status(403).json({ error: "Profil utilisateur introuvable" });
    }

    // On attache ces infos à la requête pour les routes suivantes
    req.userId = userId;
    req.userProfile = profile;

    next();
  } catch (err) {
    console.error("Erreur middleware requireProfile:", err.message);
    res.status(401).json({ error: "Token invalide ou expiré" });
  }
};
