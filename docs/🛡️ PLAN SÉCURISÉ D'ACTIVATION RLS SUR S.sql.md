🛡️ PLAN SÉCURISÉ D'ACTIVATION RLS SUR SUPABASE
✅ Étape 1 – Activer RLS sans appliquer de restrictions
Cela permet de tester sans casser tes appels existants.

sql
Copy
Edit
-- Étape 1 : Activer RLS sur chaque table
ALTER TABLE "UserProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Vote" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Interest" ENABLE ROW LEVEL SECURITY;

-- Étape 2 : Créer une politique permissive temporaire
CREATE POLICY "Temp: allow all" ON "UserProfile" FOR ALL USING (true);
CREATE POLICY "Temp: allow all" ON "Vote" FOR ALL USING (true);
CREATE POLICY "Temp: allow all" ON "Interest" FOR ALL USING (true);
🧪 Tu peux maintenant tester tout ton app comme avant, mais RLS est activé : c’est le moment idéal pour faire tes tests.

✅ Étape 2 – Créer les politiques RLS réelles (lecture/écriture liées à l'utilisateur)
🔹 UserProfile
sql
Copy
Edit
-- Lecture : chaque utilisateur peut lire son propre profil
CREATE POLICY "Users can read their own profile"
ON "UserProfile"
FOR SELECT
USING (user_id = auth.uid());

-- Modification : chaque utilisateur peut mettre à jour son propre profil
CREATE POLICY "Users can update their own profile"
ON "UserProfile"
FOR UPDATE
USING (user_id = auth.uid());

-- Insertion : seul un utilisateur peut insérer un profil avec son propre ID
CREATE POLICY "Users can insert their own profile"
ON "UserProfile"
FOR INSERT
WITH CHECK (user_id = auth.uid());
🔹 Vote
sql
Copy
Edit
-- Lecture des votes de l’utilisateur
CREATE POLICY "Users can read their votes"
ON "Vote"
FOR SELECT
USING (user_id = auth.uid());

-- Création de vote (l’utilisateur ne vote que pour lui-même)
CREATE POLICY "Users can insert their vote"
ON "Vote"
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Mise à jour de son propre vote
CREATE POLICY "Users can update their vote"
ON "Vote"
FOR UPDATE
USING (user_id = auth.uid());
🔹 Interest
sql
Copy
Edit
-- Lecture de ses intérêts
CREATE POLICY "Users can read their interests"
ON "Interest"
FOR SELECT
USING (user_id = auth.uid());

-- Ajout d’un intérêt
CREATE POLICY "Users can insert their interest"
ON "Interest"
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Mise à jour d’un intérêt
CREATE POLICY "Users can update their interest"
ON "Interest"
FOR UPDATE
USING (user_id = auth.uid());
✅ Étape 3 – Tester les vraies politiques
Quand tu es prêt, tu peux désactiver les politiques permissives (Temp: allow all) pour tester uniquement les règles réelles :

sql
Copy
Edit
DROP POLICY "Temp: allow all" ON "UserProfile";
DROP POLICY "Temp: allow all" ON "Vote";
DROP POLICY "Temp: allow all" ON "Interest";
👨‍🔬 Comment tester en toute sécurité ?
Va dans l'interface Supabase > SQL Editor > Run Query.

Clique sur "Run as user" (et choisis anon).

Exécute une requête comme :

sql
Copy
Edit
select \* from "UserProfile";
Si ça ne renvoie rien → ça fonctionne (l'utilisateur anonyme ne peut rien voir).
Teste ensuite avec auth.uid() = utilisateur connu.

Parfait, merci pour ton schéma détaillé. Voici un script SQL complet et sécurisé, que tu peux copier-coller dans Supabase pour :

Activer les RLS sur toutes les tables sensibles liées à UserProfile

Créer des politiques permissives temporaires (tests sans casse)

Créer des politiques définitives par utilisateur (relecture/écriture strictes)

Te permettre un test par étapes avant de supprimer les règles temporaires

✅ 📜 Script SQL complet et progressif (à coller dans Supabase)
sql
Copy
Edit

---

-- 1. Activer RLS

---

ALTER TABLE "public"."UserProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Vote" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Interest" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."FilmComment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."ActivityLog" ENABLE ROW LEVEL SECURITY;

---

-- 2. Politique TEMPORAIRE permissive pour ne rien casser pendant les tests

---

CREATE POLICY "Temp: allow all" ON "public"."UserProfile" FOR ALL USING (true);
CREATE POLICY "Temp: allow all" ON "public"."Vote" FOR ALL USING (true);
CREATE POLICY "Temp: allow all" ON "public"."Interest" FOR ALL USING (true);
CREATE POLICY "Temp: allow all" ON "public"."FilmComment" FOR ALL USING (true);
CREATE POLICY "Temp: allow all" ON "public"."ActivityLog" FOR ALL USING (true);

---

-- 3. Politiques RLS réelles (sécurisées par utilisateur)

---

-- 🎭 UserProfile
CREATE POLICY "Read own profile"
ON "public"."UserProfile"
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Update own profile"
ON "public"."UserProfile"
FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Insert own profile"
ON "public"."UserProfile"
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- 🎫 Vote
CREATE POLICY "Read own vote"
ON "public"."Vote"
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Insert own vote"
ON "public"."Vote"
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Update own vote"
ON "public"."Vote"
FOR UPDATE
USING (user_id = auth.uid());

-- 💡 Interest
CREATE POLICY "Read own interest"
ON "public"."Interest"
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Insert own interest"
ON "public"."Interest"
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Update own interest"
ON "public"."Interest"
FOR UPDATE
USING (user_id = auth.uid());

-- 💬 FilmComment
CREATE POLICY "Read own comment"
ON "public"."FilmComment"
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Insert own comment"
ON "public"."FilmComment"
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Update own comment"
ON "public"."FilmComment"
FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Delete own comment"
ON "public"."FilmComment"
FOR DELETE
USING (user_id = auth.uid());

-- 📜 ActivityLog (lecture seule par utilisateur)
CREATE POLICY "Read own activity logs"
ON "public"."ActivityLog"
FOR SELECT
USING (userId = auth.uid());

CREATE POLICY "Insert own activity log"
ON "public"."ActivityLog"
FOR INSERT
WITH CHECK (userId = auth.uid());
🧪 Étapes de test
Laisse les politiques Temp: allow all actives pendant que tu vérifies que tout marche.

Teste tous tes composants Nuxt (votes, intérêts, profils, commentaires, logs).

Quand tout fonctionne : supprime les politiques temporaires :

sql
Copy
Edit
DROP POLICY "Temp: allow all" ON "public"."UserProfile";
DROP POLICY "Temp: allow all" ON "public"."Vote";
DROP POLICY "Temp: allow all" ON "public"."Interest";
DROP POLICY "Temp: allow all" ON "public"."FilmComment";
DROP POLICY "Temp: allow all" ON "public"."ActivityLog";
