Objectif global
Mettre en place un système de vote individualisé et groupé par cinéma, avec :

🧑 un seul vote par utilisateur et par film

🏛 groupe de cinéma partagé (ex : "Cinéma de la plage", "Cinéma Test")

📊 résultats visibles par groupe uniquement

✅ Étape 1 – Structure des tables Supabase (ou Prisma si tu gères la DB)
cinemas
ts
Copy
Edit
id: number
name: string
slug: string (unique)
users (déjà géré par Supabase auth)
Ajoute un champ :

ts
Copy
Edit
cinema_id: number (relation vers `cinemas.id`)
(à stocker dans user_metadata ou dans une table user_profiles selon ton modèle)

votes
ts
Copy
Edit
id: number
user_id: uuid (FK Supabase auth)
film_id: number (FK films)
note: number (1–5)
commentaire: string?
cinema_id: number (copié depuis user au moment du vote)
created_at: timestamp
Avec contrainte unique :

sql
Copy
Edit
UNIQUE(user_id, film_id)
✅ Étape 2 – Côté Nuxt
🔐 Authentification
via useSupabaseUser() + useSupabaseClient()

possibilité de login avec email+MDP ou lien magique

formulaire d’invitation = email + assignation à un cinéma

🗳 Page de vote (/vote)
Le user voit la liste des films

Pour chaque film, peut voter une seule fois (v-if="!hasVoted(film.id)")

Le vote est envoyé à une route API POST /votes

ts
Copy
Edit
await $fetch('/api/votes', {
method: 'POST',
body: { film_id, note, commentaire }
})
📊 Résultats par groupe
Page /resultats

Affiche les moyennes et commentaires du cinéma courant du user

requête à /api/votes/resultats?cinema_id=...

✅ Étape 3 – Côté backend (API)
POST /api/votes
ts
Copy
Edit
// Vérifie que user n’a pas déjà voté pour ce film
const existing = await prisma.vote.findFirst({
where: { user_id, film_id }
})
if (existing) return res.status(400).json({ error: 'Vote déjà enregistré' })

await prisma.vote.create({
data: {
user_id,
film_id,
note,
commentaire,
cinema_id // récupéré depuis user
}
})
GET /api/votes/resultats?cinema_id=...
ts
Copy
Edit
const votes = await prisma.vote.findMany({
where: { cinema_id },
include: { film: true }
})

const resultats = groupByFilm(votes)
res.json(resultats)
✅ Étape 4 – Interface admin d’invitation
Liste des users

Ajout d’un user : email + assignation à un cinéma + rôle éventuel

Envoi d’un email avec lien ou mot de passe temporaire

🔒 (optionnel) RLS Supabase
Si tu utilises Supabase côté client directement :

Active RLS sur votes

Règle : user ne peut lire/écrire que ses propres votes

Affichage des votes agrégés doit passer par une function SQL ou via API privée

Souhaites-tu que je t’envoie :

le script Prisma des migrations ?

une maquette de l’interface de vote ?

une interface admin pour gérer les utilisateurs + affectation aux cinémas ?

Ta situation actuelle
✅ Tu utilises Supabase Auth pour gérer les utilisateurs (inscription, login, session)

✅ Tu utilises Prisma avec une base PostgreSQL pour le backend de ton app (films, votes, etc.)

🧩 Tu veux lier les deux : les user_id de Supabase Auth avec tes votes, cinemas, etc.

✅ Bonne nouvelle : c’est parfaitement compatible, car…
Supabase Auth stocke les utilisateurs dans une table PostgreSQL interne (auth.users).
Et comme Prisma peut aussi se connecter à cette base, tu peux les relier sans problème.

📌 Solution recommandée (et simple)

1. 🔐 Continuer à utiliser Supabase Auth pour l’authentification
   ts
   Copy
   Edit
   const user = useSupabaseUser()
   const userId = user.value?.id // string (UUID)
2. 🧭 Dans Prisma, tu utilises ce user_id comme clé étrangère dans ta table votes :
   vote.model.prisma
   ts
   Copy
   Edit
   model Vote {
   id Int @id @default(autoincrement())
   film Film @relation(fields: [filmId], references: [id])
   filmId Int
   user_id String // ← correspond au Supabase user.id (UUID)
   note Int
   commentaire String?
   cinema Cinema @relation(fields: [cinemaId], references: [id])
   cinemaId Int
   createdAt DateTime @default(now())

@@unique([user_id, filmId])
} 3. 📁 Pour afficher le groupe (cinéma) d’un utilisateur, tu as deux options :
🔹 Option 1 : Stocker dans user_metadata (côté Supabase)
Pas besoin de table intermédiaire

Inconvénient : pas consultable facilement via Prisma

🔹 Option 2 (recommandée) : créer une table user_profiles dans Prisma
ts
Copy
Edit
model UserProfile {
user_id String @id // identique à auth.users.id
cinema Cinema @relation(fields: [cinemaId], references: [id])
cinemaId Int
cinemaRole String? // 'INVITE', 'MEMBRE', 'PROGRAMMEUR', etc.
}
👉 C’est cette table qui te permet de lier proprement Supabase Auth à ta structure Prisma

✅ Résumé
Donnée Gérée par Visible depuis Prisma ? Utilisée pour...
auth.users Supabase Auth ✅ oui (auth.users) authentification
user_profiles Prisma ✅ oui cinéma associé, rôle logique
votes Prisma ✅ oui une ligne par user x film

🔧 Tu veux que je t’aide à :
générer les modèles Prisma (Vote, UserProfile, Cinema) ?

créer la relation avec auth.users dans Prisma ?

configurer les accès via Supabase RLS si nécessaire ?

Je peux aussi te préparer les migrations, les routes API, et un composant de vote Nuxt si tu veux.
