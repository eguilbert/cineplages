Responsve
pb login

AVANT OUVERTURE

IMPORTANT

= tester Interests (update vue, enregistrement correct avec nouveau user)

SCORES!!
Commenaire: delete + proprio

- post commentaire
- MAJ films
- MAJ interets labels
- role (cinema, ce qu'on voit comme invite)
- inscription
- transposer votes

============
regler probleme mdp

- simplifier
- regler: mdp perdu?

Nationalites films

Division Agon/Coutainville (dans les resultats)

Ameliorer INterets:

- Pas interessé
- Pourquoi pas
- Très Intéressé
- Indispensable

BUGS a resoudre

affichage Interests quand on ajoute (apres avoir change de selection)
load nouvelle seletcion: requestes doublées
Directors absents (verifier sur une nouvelle selection, et faire un update sur ancien avec rajout dns update du director)

SCORE

COMMENTAIRES

- verifier quand commentire d'un autre, comment il apparait
- reactivite
- commenaire uniquement dans Selections Prog?

NEW USER: no email received

!!- enregistrement des Interests (doublés)
ex film 306 1 seul interet, 2 resultats

++ ajouter coups de coeur sur les films (par user)
--une page ou retrouver tous ceux du cinema
(le coup de coeur de Maryvonne)
===========

PROCHAINE ETAPE

Programmation score, vote et transformation de la selection

1. bloquer la prog octobre avec resultats
2. ouvrir commentaires etc.

1.dans DB modifier selection, films

CE qui manque

- dans la DB

SELECTION
desc? String ou Text
date_vote? Date
closed Booolean (default false)
selectedFilms? [filmIds...]
@Cinema
()

SELECTIONFILM
selected Boolean

FILM
statut enum picked,

PROJECTION
projetedFilms [filmIds...]
(relation entre cinema et films)

ENTREES
Entree Int
rel entre cinema et Film

USER_PROFILE

- Programmat
  (ont le droit d'ajouter des commentaires, liens + awards )

============
Id:
prog du public du mois, sur un choix de 5 films
idee de rassembler fideles qui ont 1 carte

le login doit être associé à la carte

============

PROG

Identifier AGon pour creer liste pour Agon
consequences:

- cinema de la plage doit recouper 2 id en une vision
- ou bien hauteville 1, agon 2
- en commun: les selections, vues par les 2
- les votes sont distingués, mais visibles pour les 2
- je vois tous les Cinema > UserProfile > Interests
- e fait chaque Selection appartient a un cinema (et n!est ue que par les benevoles du cinema )
- change un peu tous les acces; chq selection n,est vue que par e

\*\*trouver un systeme pour montrer films selectionner, ecarter les autres, documenter la quantité de films retenus,
proposer

Ajouter Cine Agon pour distinguer et creer une selection Agon

Avoir réserve films pour Senor, british, rattrapages\*\*
Pour la selection de la Prog,
certains films ajoutés d'office (bcp de votes, evidence, unanime en reu)
Cela crée une liste de films à programmer avec leur quantité (par categorie)
Recommandation sortie nationale? pour indication à Stephane

## Important une fois finie la prog, figer liste (plus de votes, interets, etc.) et conserver dans une liste Prog, en attendant de la completer par dates projections, chiffres entrées,

Au fur et a mesure que la liste se complete, petitte liste (poster en taille vignette, titre et cate, date), en haut de page.

Bouton APPROUVER LA PROGRAMMATION

Ajouter commentaire pour tous les programmeurs
DONC
créer user type = Prorgammeur

- Curieux ou A discuter ?

- Ajouter Haut de la page dans le menu flottant

Selection pouvoir en retirer (mauvaise date)

IMPORTANT: pouvoir modifier une fiche: date, titre, pays, trailer

case pour British et senior

Ajout possibiite de filtrer Genres (Comedie)

BUG why films sans director

AMELIORATION
PLUS DE FEEDBACK EN TOASTS
requetes: verifier requetes qui échouent
import tmdb a ameliorer

- quand on vote, possibilte savoir les films qu'on retient
  avec decompte ou bouton pour retenir automatiquement les films
- on n'a pas de suivi de ce qui est selectionné, sorti et si ça a marché
- chaque film devrait portre la trace de ses sorties, nombre de projections et nb de spectateurs

todo
FEEDBACk toast
regler toutes les requetes qui echouent

- capacite d'importer un seul film dans une categorie
- - stats resultat des votes

ACTUALISATION des films
comment faire:
invoquer seulement les plus courantes, importantes; date, titre, trailer

VOTES
3 instruments pour comtabiliser l'interet:
interets, vote, rating
Interets et rating: personnels
INterets et votes: propres au cinema
Vote: realise en presence, une seule fois.

utiliser table Vote: ajouter date + nombre de participants
Vote ponctuel, ensuite fermé.
On pourra utiliser le rating de façon personnelle (le rendre personnel) et compiler
? comment compiler interets + votes

BEFORE meeting

- tester vote
- opt: faire marcher interests

ADMIN

- refaire l,Admin avec la creation de user, rajouter cinema
- et donc que le userprofile soit créer dans la volée avec le cinema

Import films
!! Import Si film existe ne pas changer de categorie

- possibilite de changer categorie en selection

Il faut que les vottes soient comptabilisés par cinema

GENERAL

- toast message when fetch, save etc.

PRESELECTION

ok - rajouter lien vers la page
ok - possiblite rajouter BA/trailer direct

- rajouter qté films sélectionn.és dans chaque categ
- toute la case cliquable

VOTE
ne pas confondre avec rating
par invité;

- intéressé
- je veux le voir
- pas intéressé

SELECTION

ok - enlever maj
ok - gerer actions du bas: si vide ne pas afficher, et mettre un bouton + qui ouvre un menu d'actions pour ajouter:
tag, commentaire, lien, award
ok - compter films
ok - sauvegarder awards, liens etc.
ok - modifier la page pour n'afficher qu'une selection a la fois
ok - dans chaque case Film, ajout notes, tags
ok - dans chaque case Film, awards + external links
ok - faire une vue avec films dans la largeur
ok - petit menu lateral pour naviguer d'une section a l'autre
ok - Filtrer par date, categorie

- menu flottant retractable
- pouvoir chqnger categorie
- possibilite enlever films
- save sélection

PERSONNALISATION

- votes par personne
- envie de le voir ou suivre ce film
- avec pages de suivi des films

Seance Progr

- ajout votes (en direct)
- plus tard votes a distance (a rajouter au total)

DONE - corriger selection/deselection

//BUGS

ok - update Sel avec nvx films: comparer le PUT et le POST

- donner possibilité d'importer un film precis pour l'ajouter a une selection par ex.
- print

- pouvoir changer les données d,unn film facilement: sa categorie, sa date de sortie par exemple. pouvoir mettre a jour date sortie et titre fr
- films mettre nationalite en toutes lettres

ok - import et films: mettre la bonne date de sortie en france

- changer date fin automatiquement (une semaine apres)
- dans sauvegarde Nom sel mettre par defaut date

ok- page Mes selections: ne pas tout ouvrir mais mettre des liens ou boutons

EVOL

ok - dans selections, pouvoir trier par titre, et par date
ok - !!Pouvoir remttre a jour les films

films:

ok - Recherche attention a la casse

GRILLE

- Manque une etape: savoir si le film passe en 2e, 3e semain etc. et repartir les films en semaine.
- ensuite pouvoir importer par semaine
- en fait appeler grille de semaine 1 (du tant à tant), etc.
  et automatiquement les films qui vienent avec

Permettre classement par genre A+E, GP, DOC, jeunesse
puis par semaine de sortie

DONE - creer DB de films pour ajouter Awards et autres notes, et conserver

- Statistiques pour la selection (nb films art + essai, etc. par semaine ou pour la période)
-

//EVOL
permettre aux absents de voter pour des films
(+ complique: ouvrir a tous les benevoles avec login perso)
