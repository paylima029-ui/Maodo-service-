import { db, formationsTable, modulesTable, lessonsTable, quizzesTable, quizOptionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const SLUG = "python-debutant";

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function lesson(
  title: string,
  theory: string,
  quizzes: Array<{ question: string; options: Array<{ text: string; correct: boolean }> }> = []
) {
  return { title, theory, quizzes };
}

/* ─────────────────────────────────────────────
   FORMATION DATA
───────────────────────────────────────────── */
const FORMATION = {
  slug: SLUG,
  title: "Python — De Zéro à Intermédiaire",
  description: "Maîtrisez Python de A à Z : variables, boucles, fonctions, listes, POO et projets concrets. Formation progressive pour débutants, conçue pour atteindre le niveau intermédiaire.",
  category: "programmation",
  modules: [

    /* ══════════════════════════════════════════
       MODULE 1 : Introduction à Python
    ══════════════════════════════════════════ */
    {
      title: "Module 1 — Introduction à Python",
      lessons: [
        lesson("Qu'est-ce que Python ?", `
## Qu'est-ce que Python ?

Python est un **langage de programmation** créé par Guido van Rossum en 1991. C'est aujourd'hui l'un des langages les plus populaires au monde, utilisé dans des domaines très variés.

### Pourquoi apprendre Python ?

- **Facile à lire** : la syntaxe de Python ressemble à du texte en anglais
- **Polyvalent** : web, data science, intelligence artificielle, automatisation, jeux…
- **Gratuit et open-source** : aucun coût de licence
- **Grande communauté** : millions de développeurs, tutoriels partout

### Exemples d'utilisation

- Instagram, YouTube, Netflix utilisent Python
- Les chercheurs en IA utilisent Python avec TensorFlow et PyTorch
- Les data scientists analysent des millions de données avec pandas
- Les administrateurs système automatisent des tâches répétitives

### Votre premier aperçu

\`\`\`python
print("Bonjour, futur développeur Python !")
\`\`\`

\`\`\`output
Bonjour, futur développeur Python !
\`\`\`

> 💡 Python utilise l'indentation (les espaces en début de ligne) pour structurer le code. C'est une caractéristique unique et importante.

### Ce que vous allez apprendre

À la fin de cette formation, vous serez capable de :
1. Écrire des programmes Python complets
2. Manipuler des données (listes, dictionnaires…)
3. Créer vos propres fonctions et classes
4. Réaliser des projets pratiques concrets
`, [
          {
            question: "Qui a créé Python ?",
            options: [
              { text: "Linus Torvalds", correct: false },
              { text: "Guido van Rossum", correct: true },
              { text: "James Gosling", correct: false },
              { text: "Brendan Eich", correct: false },
            ]
          },
          {
            question: "Python est-il un langage payant ?",
            options: [
              { text: "Oui, il faut acheter une licence", correct: false },
              { text: "Non, il est gratuit et open-source", correct: true },
              { text: "Gratuit seulement pour les étudiants", correct: false },
              { text: "Payant pour usage commercial", correct: false },
            ]
          }
        ]),

        lesson("Installer Python et l'environnement de travail", `
## Installer Python

### Étape 1 : Télécharger Python

Rendez-vous sur **python.org** et téléchargez la dernière version stable (3.12+).

> ⚠️ Lors de l'installation sur Windows, cochez impérativement **"Add Python to PATH"** avant de cliquer sur "Install Now".

### Étape 2 : Vérifier l'installation

Ouvrez un terminal (CMD sur Windows, Terminal sur Mac/Linux) et tapez :

\`\`\`python
python --version
\`\`\`

\`\`\`output
Python 3.12.0
\`\`\`

### Étape 3 : Choisir un éditeur

Pour écrire du code Python, nous recommandons **VS Code** (gratuit) :

1. Téléchargez VS Code sur **code.visualstudio.com**
2. Installez l'extension **Python** (de Microsoft)
3. Créez un fichier \`mon_programme.py\`

### L'interpréteur interactif (REPL)

Tapez simplement \`python\` dans le terminal pour ouvrir le mode interactif :

\`\`\`python
>>> 2 + 2
4
>>> print("Bonjour !")
Bonjour !
>>> exit()
\`\`\`

> 💡 Le REPL (Read-Eval-Print Loop) est parfait pour tester rapidement des petits morceaux de code.

> ✏️ **Exercice** : Installez Python, ouvrez le terminal interactif et calculez \`15 * 8\`. Quel est le résultat ?
`),

        lesson("Mon premier programme : Hello World", `
## Mon premier programme

La tradition en programmation veut que le premier programme affiche "Hello, World !". Voyons comment faire en Python.

### Créer le fichier

Créez un fichier \`hello.py\` et écrivez :

\`\`\`python
print("Hello, World !")
\`\`\`

### Exécuter le programme

Dans le terminal, naviguez vers votre fichier et tapez :

\`\`\`python
python hello.py
\`\`\`

\`\`\`output
Hello, World !
\`\`\`

### Comprendre \`print()\`

La fonction \`print()\` affiche du texte dans le terminal. Vous pouvez afficher plusieurs choses :

\`\`\`python
print("Bonjour tout le monde !")
print("Je m'appelle Python")
print("J'ai", 30, "ans")
print("La somme de 5 + 3 =", 5 + 3)
\`\`\`

\`\`\`output
Bonjour tout le monde !
Je m'appelle Python
J'ai 30 ans
La somme de 5 + 3 = 8
\`\`\`

### Afficher plusieurs valeurs sur une ligne

\`\`\`python
print("Prénom :", "Alice", "| Âge :", 25)
print("---" * 10)
\`\`\`

\`\`\`output
Prénom : Alice | Âge : 25
------------------------------
\`\`\`

> 💡 La virgule dans \`print()\` ajoute automatiquement un espace entre les éléments. Le symbole \`*\` répète une chaîne !

> ✏️ **Exercice** : Écrivez un programme qui affiche votre prénom, votre âge et votre ville préférée sur trois lignes séparées.
`, [
          {
            question: "Quelle fonction Python permet d'afficher du texte ?",
            options: [
              { text: "show()", correct: false },
              { text: "display()", correct: false },
              { text: "print()", correct: true },
              { text: "write()", correct: false },
            ]
          }
        ]),

        lesson("Les commentaires en Python", `
## Les commentaires

Un **commentaire** est du texte dans le code que Python ignore complètement. Les commentaires servent à expliquer ce que fait le code.

### Commentaire sur une ligne

Utilisez le symbole \`#\` :

\`\`\`python
# Ceci est un commentaire
print("Hello")  # Commentaire en fin de ligne

# Calculer l'âge d'une personne née en 1995
age = 2024 - 1995
print("Âge :", age)
\`\`\`

\`\`\`output
Hello
Âge : 29
\`\`\`

### Commentaire sur plusieurs lignes

Utilisez trois guillemets \`"""\` :

\`\`\`python
"""
Ce programme calcule l'aire d'un rectangle.
Auteur : Votre Nom
Date : Janvier 2024
"""

longueur = 10
largeur = 5
aire = longueur * largeur
print("Aire du rectangle :", aire, "cm²")
\`\`\`

\`\`\`output
Aire du rectangle : 50 cm²
\`\`\`

### Pourquoi commenter son code ?

- Pour expliquer une logique complexe
- Pour désactiver temporairement du code
- Pour que d'autres (ou vous dans 6 mois) comprennent votre code

\`\`\`python
# DÉSACTIVÉ TEMPORAIREMENT
# print("Cette ligne ne s'exécute pas")

print("Cette ligne s'exécute")  # Active
\`\`\`

> 💡 Un bon code est un code bien commenté. Prenez l'habitude de commenter dès le début !

> ✏️ **Exercice** : Reprenez votre programme Hello World et ajoutez : un commentaire en haut décrivant le programme, et un commentaire sur chaque ligne \`print()\`.
`),

        lesson("Les erreurs courantes en Python", `
## Comprendre les erreurs Python

Les erreurs font partie de la programmation. Python affiche des messages d'erreur clairs pour vous aider à les corriger.

### Types d'erreurs courantes

#### 1. SyntaxError — Erreur de syntaxe

\`\`\`python
print("Bonjour"  # Parenthèse fermante manquante
\`\`\`

\`\`\`output
SyntaxError: '(' was never closed
\`\`\`

#### 2. NameError — Variable non définie

\`\`\`python
print(age)  # 'age' n'a pas été définie
\`\`\`

\`\`\`output
NameError: name 'age' is not defined
\`\`\`

#### 3. IndentationError — Mauvaise indentation

\`\`\`python
if True:
print("Mal indenté")  # Doit être décalé
\`\`\`

\`\`\`output
IndentationError: expected an indented block
\`\`\`

### Comment lire un message d'erreur ?

\`\`\`python
# Exemple avec une erreur volontaire
prenom = "Alice"
print(Prenom)  # Majuscule incorrecte !
\`\`\`

\`\`\`output
NameError: name 'Prenom' is not defined. Did you mean: 'prenom'?
\`\`\`

Python vous indique :
1. **Le type d'erreur** : \`NameError\`
2. **La description** : \`'Prenom' is not defined\`
3. **Une suggestion** : \`Did you mean: 'prenom'?\`

> 💡 Ne paniquez pas face aux erreurs ! Lisez le message calmement, cherchez la ligne indiquée, et corrigez. Chaque erreur est une occasion d'apprendre.

> ⚠️ Python est **sensible à la casse** : \`prenom\` et \`Prenom\` sont deux choses différentes !

### Corriger les erreurs

\`\`\`python
# Code corrigé
prenom = "Alice"
print(prenom)  # Minuscule correcte
\`\`\`

\`\`\`output
Alice
\`\`\`

> ✏️ **Exercice** : Identifiez et corrigez les 3 erreurs dans ce code :
> \`\`\`python
> # Calcul de surface
> longueur = 8
> largeur = 4
> surface = longueur * Largeur
> Print("Surface :", surface
> \`\`\`
`),

        lesson("Bilan du Module 1 et Quiz", `
## Récapitulatif du Module 1

Félicitations ! Vous avez terminé le premier module. Voici ce que vous avez appris :

### Ce que vous savez maintenant

| Concept | Ce que vous avez appris |
|---|---|
| Python | Langage créé en 1991, gratuit, polyvalent |
| Installation | Python + VS Code + vérification |
| print() | Afficher du texte dans le terminal |
| Commentaires | \`#\` pour une ligne, \`"""\` pour plusieurs |
| Erreurs | SyntaxError, NameError, IndentationError |

### Révision rapide

\`\`\`python
# Mon premier vrai programme Python
# Auteur : Étudiant motivé
# Module 1 - Introduction

print("=" * 40)
print("   Bienvenue dans le monde Python !")
print("=" * 40)
print()
print("Ce langage va changer votre vie.")
print("Continuez à apprendre !")
\`\`\`

\`\`\`output
========================================
   Bienvenue dans le monde Python !
========================================

Ce langage va changer votre vie.
Continuez à apprendre !
\`\`\`

> 💡 La clé de l'apprentissage en programmation : **pratiquer tous les jours**, même 15 minutes. La régularité bat l'intensité !

### Prochain module

Dans le **Module 2**, vous allez apprendre à stocker des données dans des **variables** et à travailler avec différents types de données.

> ✏️ **Exercice final du module** : Créez un programme qui affiche votre carte de visite avec votre nom, votre profession (ou futur métier) et votre email, le tout entouré d'une bordure de tirets.
`, [
          {
            question: "Quel symbole introduit un commentaire en Python ?",
            options: [
              { text: "//", correct: false },
              { text: "/* */", correct: false },
              { text: "#", correct: true },
              { text: "--", correct: false },
            ]
          },
          {
            question: "Quelle erreur Python signale une variable non définie ?",
            options: [
              { text: "SyntaxError", correct: false },
              { text: "TypeError", correct: false },
              { text: "IndentationError", correct: false },
              { text: "NameError", correct: true },
            ]
          },
          {
            question: "Comment afficher 'Bonjour' avec Python ?",
            options: [
              { text: "echo('Bonjour')", correct: false },
              { text: "print('Bonjour')", correct: true },
              { text: "console.log('Bonjour')", correct: false },
              { text: "display('Bonjour')", correct: false },
            ]
          }
        ]),
      ]
    },

    /* ══════════════════════════════════════════
       MODULE 2 : Variables et Types
    ══════════════════════════════════════════ */
    {
      title: "Module 2 — Variables et Types de Données",
      lessons: [
        lesson("Les variables", `
## Les variables

Une **variable** est une boîte étiquetée dans laquelle vous rangez une valeur. Vous pouvez y mettre n'importe quoi : un nombre, du texte, etc.

### Créer une variable

\`\`\`python
prenom = "Alice"
age = 25
taille = 1.68
est_etudiant = True

print(prenom)
print(age)
print(taille)
print(est_etudiant)
\`\`\`

\`\`\`output
Alice
25
1.68
True
\`\`\`

### Règles de nommage

- Commence par une lettre ou \`_\`
- Peut contenir lettres, chiffres, \`_\`
- **Pas d'espaces**, pas d'accents
- Sensible à la casse : \`age\` ≠ \`Age\`

\`\`\`python
# Noms valides
mon_prenom = "Bob"
_valeur = 42
score1 = 100

# Noms invalides (erreur !)
# 1score = 10      → commence par un chiffre
# mon prenom = ""  → contient un espace
# def = 5          → 'def' est un mot réservé
\`\`\`

### Modifier une variable

\`\`\`python
score = 0
print("Score initial :", score)

score = 10
print("Après une victoire :", score)

score = score + 5
print("Après un bonus :", score)
\`\`\`

\`\`\`output
Score initial : 0
Après une victoire : 10
Après un bonus : 15
\`\`\`

### Assigner plusieurs variables

\`\`\`python
# Plusieurs variables en une ligne
x, y, z = 1, 2, 3
print(x, y, z)

# Même valeur pour plusieurs variables
a = b = c = 0
print(a, b, c)
\`\`\`

\`\`\`output
1 2 3
0 0 0
\`\`\`

> 💡 Utilisez des noms de variables **descriptifs** : \`age_utilisateur\` est bien meilleur que \`a\` ou \`x\`.

> ✏️ **Exercice** : Créez des variables pour stocker votre prénom, votre âge, votre ville et votre couleur préférée. Affichez-les avec une phrase complète.
`, [
          {
            question: "Lequel de ces noms de variable est INVALIDE en Python ?",
            options: [
              { text: "mon_age", correct: false },
              { text: "_valeur", correct: false },
              { text: "1score", correct: true },
              { text: "score1", correct: false },
            ]
          }
        ]),

        lesson("Les nombres entiers (int)", `
## Les entiers — type \`int\`

Les **entiers** sont des nombres sans virgule : \`0\`, \`42\`, \`-7\`, \`1000000\`.

### Créer des entiers

\`\`\`python
age = 25
population = 1_000_000  # Le _ améliore la lisibilité
temperature_min = -15
zero = 0

print(age)
print(population)
print(temperature_min)
\`\`\`

\`\`\`output
25
1000000
-15
\`\`\`

### Opérations arithmétiques

\`\`\`python
a = 20
b = 6

print("Addition :", a + b)
print("Soustraction :", a - b)
print("Multiplication :", a * b)
print("Division réelle :", a / b)
print("Division entière :", a // b)
print("Modulo (reste) :", a % b)
print("Puissance :", a ** 2)
\`\`\`

\`\`\`output
Addition : 26
Soustraction : 14
Multiplication : 120
Division réelle : 3.3333333333333335
Division entière : 3
Modulo (reste) : 2
Puissance : 400
\`\`\`

### Bases numériques

\`\`\`python
# Binaire (base 2)
print(0b1010)    # 10 en décimal

# Hexadécimal (base 16)
print(0xFF)      # 255 en décimal

# Octal (base 8)
print(0o17)      # 15 en décimal
\`\`\`

\`\`\`output
10
255
15
\`\`\`

> 💡 L'opérateur \`%\` (modulo) est très utile pour savoir si un nombre est pair : \`n % 2 == 0\` → n est pair.

> ✏️ **Exercice** : Calculez et affichez le nombre de secondes dans une journée (24h × 60min × 60s) puis dans une année.
`),

        lesson("Les nombres décimaux (float)", `
## Les flottants — type \`float\`

Les **flottants** sont des nombres avec une partie décimale : \`3.14\`, \`-2.5\`, \`0.0\`.

### Créer des floats

\`\`\`python
prix = 19.99
pi = 3.14159
temperature = -4.5
pourcentage = 0.75

print(prix)
print(pi)
\`\`\`

\`\`\`output
19.99
3.14159
\`\`\`

### Opérations avec des floats

\`\`\`python
longueur = 5.5
largeur = 3.2

aire = longueur * largeur
print("Aire :", aire)
print("Demi-périmètre :", longueur + largeur)

# Arrondir un float
resultat = 10 / 3
print("Résultat brut :", resultat)
print("Arrondi à 2 décimales :", round(resultat, 2))
\`\`\`

\`\`\`output
Aire : 17.6
Demi-périmètre : 8.7
Résultat brut : 3.3333333333333335
Arrondi à 2 décimales : 3.33
\`\`\`

### Notation scientifique

\`\`\`python
vitesse_lumiere = 3e8      # 300 000 000 m/s
taille_atome = 1e-10       # 0.0000000001 m

print(vitesse_lumiere)
print(taille_atome)
\`\`\`

\`\`\`output
300000000.0
1e-10
\`\`\`

### Précision des floats

\`\`\`python
# Attention : les flottants ne sont pas toujours précis
print(0.1 + 0.2)
print(round(0.1 + 0.2, 1))  # Solution : arrondir
\`\`\`

\`\`\`output
0.30000000000000004
0.3
\`\`\`

> ⚠️ Les floats ont des limites de précision dues à la représentation binaire. Utilisez toujours \`round()\` pour l'affichage.

> ✏️ **Exercice** : Calculez l'IMC (Indice de Masse Corporelle) avec \`imc = poids / (taille ** 2)\`. Essayez avec poids=70 kg et taille=1.75 m. Arrondissez à 2 décimales.
`),

        lesson("Les chaînes de caractères (str)", `
## Les chaînes — type \`str\`

Une **chaîne de caractères** (string) est une suite de caractères entre guillemets.

### Créer des chaînes

\`\`\`python
prenom = "Alice"
message = 'Bonjour le monde'
texte_long = """Ceci est un texte
sur plusieurs lignes.
Très pratique !"""

print(prenom)
print(message)
print(texte_long)
\`\`\`

\`\`\`output
Alice
Bonjour le monde
Ceci est un texte
sur plusieurs lignes.
Très pratique !
\`\`\`

### Opérations sur les chaînes

\`\`\`python
debut = "Bonjour"
fin = " tout le monde"

# Concaténation (assemblage)
phrase = debut + fin
print(phrase)

# Répétition
bordure = "-" * 20
print(bordure)

# Longueur
print("Longueur :", len(phrase))
\`\`\`

\`\`\`output
Bonjour tout le monde
--------------------
Longueur : 21
\`\`\`

### Les f-strings (formatage moderne)

\`\`\`python
prenom = "Marie"
age = 23
ville = "Paris"

# f-string : mettre des variables dans une chaîne
presentation = f"Je m'appelle {prenom}, j'ai {age} ans et j'habite à {ville}."
print(presentation)

# Calculs dans les f-strings
prix = 29.99
tva = 0.20
print(f"Prix TTC : {prix * (1 + tva):.2f} €")
\`\`\`

\`\`\`output
Je m'appelle Marie, j'ai 23 ans et j'habite à Paris.
Prix TTC : 35.99 €
\`\`\`

### Caractères spéciaux

\`\`\`python
print("Ligne 1\\nLigne 2")      # \\n = saut de ligne
print("Col 1\\tCol 2")          # \\t = tabulation
print("Il dit \\"Bonjour\\"")   # \\" = guillemet
\`\`\`

\`\`\`output
Ligne 1
Ligne 2
Col 1	Col 2
Il dit "Bonjour"
\`\`\`

> 💡 Les **f-strings** (introduits en Python 3.6) sont la façon moderne et recommandée de formater du texte. Utilisez-les systématiquement !

> ✏️ **Exercice** : Créez une f-string qui affiche une facture avec : produit, quantité, prix unitaire et total calculé automatiquement.
`),

        lesson("Les booléens (bool)", `
## Les booléens — type \`bool\`

Un **booléen** ne peut avoir que deux valeurs : \`True\` (vrai) ou \`False\` (faux).

### Créer des booléens

\`\`\`python
est_connecte = True
a_paye = False
est_majeur = True

print(est_connecte)
print(a_paye)
print(type(est_connecte))
\`\`\`

\`\`\`output
True
False
<class 'bool'>
\`\`\`

### Les comparaisons produisent des booléens

\`\`\`python
age = 20

print(age >= 18)    # True : 20 est >= 18
print(age == 21)    # False : 20 ≠ 21
print(age != 18)    # True : 20 ≠ 18
print(age < 18)     # False : 20 n'est pas < 18
\`\`\`

\`\`\`output
True
False
True
False
\`\`\`

### Opérateurs logiques

\`\`\`python
age = 20
a_carte = True

# and : les deux conditions doivent être vraies
peut_entrer = (age >= 18) and a_carte
print("Peut entrer :", peut_entrer)

# or : au moins une condition vraie
weekend = True
conge = False
jour_libre = weekend or conge
print("Jour libre :", jour_libre)

# not : inverse le booléen
print("N'est pas connecté :", not True)
\`\`\`

\`\`\`output
Peut entrer : True
Jour libre : True
N'est pas connecté : False
\`\`\`

### Valeur booléenne des autres types

\`\`\`python
# Falsy : False, 0, "", [], None
print(bool(0))      # False
print(bool(""))     # False
print(bool([]))     # False

# Truthy : tout le reste
print(bool(1))      # True
print(bool("abc"))  # True
print(bool([1, 2])) # True
\`\`\`

\`\`\`output
False
False
False
True
True
True
\`\`\`

> 💡 Les booléens sont le fondement de toute logique en programmation. Ils permettent de prendre des décisions dans votre code.

> ✏️ **Exercice** : Créez des variables \`temperature\` et \`pleut\`. Affichez si on peut faire un pique-nique (temperature > 20 ET il ne pleut pas).
`),

        lesson("La fonction type() et la conversion de types", `
## type() et conversion de types

### La fonction type()

\`\`\`python
age = 25
prix = 19.99
prenom = "Alice"
actif = True

print(type(age))
print(type(prix))
print(type(prenom))
print(type(actif))
\`\`\`

\`\`\`output
<class 'int'>
<class 'float'>
<class 'str'>
<class 'bool'>
\`\`\`

### Conversion de types (casting)

\`\`\`python
# str → int
age_texte = "25"
age_nombre = int(age_texte)
print(age_nombre + 1)   # Maintenant on peut calculer

# int → str
score = 100
message = "Votre score : " + str(score)
print(message)

# int → float
x = int(3.9)   # Tronque, ne pas arrondir !
print(x)       # 3

# float → int
y = float(5)
print(y)       # 5.0
\`\`\`

\`\`\`output
26
Votre score : 100
3
5.0
\`\`\`

### Conversion avec input()

\`\`\`python
# input() renvoie TOUJOURS une chaîne
age_saisi = input("Votre âge : ")
print(type(age_saisi))  # str !

# Il faut convertir pour calculer
age = int(age_saisi)
annee_naissance = 2024 - age
print(f"Vous êtes né(e) en {annee_naissance}")
\`\`\`

### Conversions risquées

\`\`\`python
try:
    x = int("abc")  # Impossible !
except ValueError as e:
    print("Erreur :", e)

try:
    y = int("3.14")  # Aussi impossible directement
except ValueError:
    y = int(float("3.14"))  # Solution : passer par float
    print(y)
\`\`\`

\`\`\`output
Erreur : invalid literal for int() with base 10: 'abc'
3
\`\`\`

> ⚠️ On ne peut pas convertir n'importe quoi en n'importe quoi. \`int("abc")\` provoque une erreur !

> ✏️ **Exercice** : Demandez à l'utilisateur d'entrer son année de naissance. Calculez et affichez son âge approximatif.
`, [
          {
            question: "Que renvoie toujours la fonction input() ?",
            options: [
              { text: "Un entier (int)", correct: false },
              { text: "Un flottant (float)", correct: false },
              { text: "Une chaîne (str)", correct: true },
              { text: "Un booléen (bool)", correct: false },
            ]
          },
          {
            question: "Quel est le résultat de int(3.9) ?",
            options: [
              { text: "4 (arrondi)", correct: false },
              { text: "3 (tronqué)", correct: true },
              { text: "3.9", correct: false },
              { text: "Erreur", correct: false },
            ]
          },
          {
            question: "Comment convertir la chaîne '42' en entier ?",
            options: [
              { text: "str(42)", correct: false },
              { text: "float('42')", correct: false },
              { text: "int('42')", correct: true },
              { text: "bool('42')", correct: false },
            ]
          }
        ]),
      ]
    },

    /* ══════════════════════════════════════════
       MODULE 3 : Opérateurs
    ══════════════════════════════════════════ */
    {
      title: "Module 3 — Opérateurs et Expressions",
      lessons: [
        lesson("Opérateurs arithmétiques", `
## Opérateurs arithmétiques

Python dispose de tous les opérateurs mathématiques nécessaires pour vos calculs.

### Les 7 opérateurs

\`\`\`python
a = 17
b = 5

print(f"{a} + {b} = {a + b}")    # Addition
print(f"{a} - {b} = {a - b}")    # Soustraction
print(f"{a} * {b} = {a * b}")    # Multiplication
print(f"{a} / {b} = {a / b}")    # Division (float)
print(f"{a} // {b} = {a // b}")  # Division entière
print(f"{a} % {b} = {a % b}")    # Modulo (reste)
print(f"{a} ** {b} = {a ** b}")  # Puissance
\`\`\`

\`\`\`output
17 + 5 = 22
17 - 5 = 12
17 * 5 = 85
17 / 5 = 3.4
17 // 5 = 3
17 % 5 = 2
17 ** 5 = 1419857
\`\`\`

### Application pratique

\`\`\`python
# Convertir des secondes en heures, minutes, secondes
total_secondes = 3661

heures = total_secondes // 3600
reste = total_secondes % 3600
minutes = reste // 60
secondes = reste % 60

print(f"{total_secondes} secondes = {heures}h {minutes}min {secondes}s")
\`\`\`

\`\`\`output
3661 secondes = 1h 1min 1s
\`\`\`

> 💡 Le **modulo** \`%\` est l'un des opérateurs les plus utiles : détecter les nombres pairs, faire des cycles, diviser en groupes…

> ✏️ **Exercice** : Un magasin a 127 articles à ranger dans des boîtes de 12. Combien de boîtes complètes ? Combien d'articles restants ?
`),

        lesson("Opérateurs de comparaison", `
## Opérateurs de comparaison

Les opérateurs de comparaison **comparent deux valeurs** et retournent \`True\` ou \`False\`.

### Les 6 opérateurs

\`\`\`python
x = 10
y = 15

print(x == y)   # Égal à ?          → False
print(x != y)   # Différent de ?    → True
print(x < y)    # Inférieur ?       → True
print(x > y)    # Supérieur ?       → False
print(x <= y)   # Inférieur ou égal → True
print(x >= y)   # Supérieur ou égal → False
\`\`\`

\`\`\`output
False
True
True
False
True
False
\`\`\`

### Comparer des chaînes

\`\`\`python
# Comparaison alphabétique
print("apple" < "banana")   # True
print("Python" == "python") # False (sensible à la casse)
print("abc" == "abc")       # True
\`\`\`

\`\`\`output
True
False
True
\`\`\`

### Chaîner les comparaisons

\`\`\`python
age = 25

# En Python, on peut chaîner les comparaisons !
est_adulte_jeune = 18 <= age <= 35
print("Adulte jeune :", est_adulte_jeune)

note = 14
mention = 10 <= note < 12
print("Mention passable :", mention)
\`\`\`

\`\`\`output
Adulte jeune : True
Mention passable : False
\`\`\`

> ⚠️ Ne confondez pas \`=\` (affectation) et \`==\` (comparaison). \`x = 5\` stocke 5 dans x. \`x == 5\` vérifie si x vaut 5.

> ✏️ **Exercice** : Créez un vérificateur de mot de passe. Demandez un mot de passe et affichez si c'est le bon (le mot de passe correct est "Python2024").
`),

        lesson("Opérateurs logiques", `
## Opérateurs logiques : and, or, not

Les opérateurs logiques permettent de **combiner des conditions**.

### L'opérateur \`and\`

Les deux conditions doivent être \`True\`.

\`\`\`python
age = 20
a_billet = True

# Table de vérité de 'and'
print(True and True)    # True
print(True and False)   # False
print(False and True)   # False
print(False and False)  # False

# Exemple pratique
peut_entrer = (age >= 18) and a_billet
print(f"Peut entrer au concert : {peut_entrer}")
\`\`\`

\`\`\`output
True
False
False
False
Peut entrer au concert : True
\`\`\`

### L'opérateur \`or\`

Au moins une condition doit être \`True\`.

\`\`\`python
est_etudiant = True
est_senior = False

# Réduction accordée si étudiant OU senior
a_reduction = est_etudiant or est_senior
print(f"A une réduction : {a_reduction}")

print(True or False)    # True
print(False or False)   # False
\`\`\`

\`\`\`output
A une réduction : True
True
False
\`\`\`

### L'opérateur \`not\`

Inverse le booléen.

\`\`\`python
connecte = False
print(f"Déconnecté : {not connecte}")

pluie = True
print(f"Beau temps : {not pluie}")
\`\`\`

\`\`\`output
Déconnecté : True
Beau temps : False
\`\`\`

### Combiner les opérateurs

\`\`\`python
age = 17
accompagne = True
a_autorisation = True

# Peut entrer si majeur, OU si mineur accompagné avec autorisation
peut_entrer = (age >= 18) or (accompagne and a_autorisation)
print(f"Accès autorisé : {peut_entrer}")
\`\`\`

\`\`\`output
Accès autorisé : True
\`\`\`

> 💡 **Court-circuit** : Python évalue \`and\` et \`or\` de gauche à droite et s'arrête dès que possible. \`False and ...\` → arrête immédiatement. \`True or ...\` → arrête immédiatement.

> ✏️ **Exercice** : Une banque accorde un prêt si le client a un salaire > 2000€ ET (pas d'autre prêt en cours OU apport > 20%). Codez cette condition.
`),

        lesson("Opérateurs d'affectation", `
## Opérateurs d'affectation augmentée

Ces opérateurs permettent de **modifier une variable de façon compacte**.

### Tableau des opérateurs

\`\`\`python
x = 10

x += 5    # x = x + 5  → 15
print(x)

x -= 3    # x = x - 3  → 12
print(x)

x *= 2    # x = x * 2  → 24
print(x)

x //= 5   # x = x // 5 → 4
print(x)

x **= 3   # x = x ** 3 → 64
print(x)

x %= 10   # x = x % 10 → 4
print(x)
\`\`\`

\`\`\`output
15
12
24
4
64
4
\`\`\`

### Application : compteur de score

\`\`\`python
score = 0
print(f"Départ : {score}")

score += 10   # Premier niveau réussi
print(f"Après niveau 1 : {score}")

score += 25   # Boss vaincu
print(f"Après le boss : {score}")

score -= 5    # Vie perdue
print(f"Après vie perdue : {score}")

score *= 2    # Multiplicateur x2
print(f"Avec multiplicateur : {score}")
\`\`\`

\`\`\`output
Départ : 0
Après niveau 1 : 10
Après le boss : 35
Après vie perdue : 30
Avec multiplicateur : 60
\`\`\`

> 💡 Ces opérateurs sont très courants dans les boucles. Vous les verrez constamment dans du vrai code Python.

> ✏️ **Exercice** : Simulez une caisse enregistreuse. Commencez avec 0 €, ajoutez 3 produits (à vos prix), appliquez une remise de 10% puis affichez le total.
`),

        lesson("Priorité des opérateurs", `
## Priorité des opérateurs

Comme en mathématiques, Python a un ordre d'évaluation des opérateurs.

### Ordre de priorité (du plus fort au plus faible)

| Priorité | Opérateur | Description |
|---|---|---|
| 1 (max) | \`**\` | Puissance |
| 2 | \`+x\`, \`-x\` | Unaire |
| 3 | \`*\`, \`/\`, \`//\`, \`%\` | Multiplication/Division |
| 4 | \`+\`, \`-\` | Addition/Soustraction |
| 5 | \`<\`, \`>\`, \`<=\`, \`>=\`, \`==\`, \`!=\` | Comparaison |
| 6 | \`not\` | Logique NOT |
| 7 | \`and\` | Logique AND |
| 8 (min) | \`or\` | Logique OR |

### Exemples

\`\`\`python
# Sans parenthèses
resultat1 = 2 + 3 * 4      # 3*4 d'abord → 14
print(resultat1)

# Avec parenthèses pour forcer l'ordre
resultat2 = (2 + 3) * 4    # 2+3 d'abord → 20
print(resultat2)

# Puissance avant multiplication
resultat3 = 2 * 3 ** 2     # 3**2=9, puis 2*9=18
print(resultat3)
\`\`\`

\`\`\`output
14
20
18
\`\`\`

### Conseil pratique

\`\`\`python
# Utilisez des parenthèses pour être explicite
age = 20
salaire = 2500

# Difficile à lire :
eligible = age >= 18 and salaire > 2000 or age >= 25

# Bien meilleur avec des parenthèses :
eligible = (age >= 18 and salaire > 2000) or (age >= 25)
print(eligible)
\`\`\`

> 💡 **Règle d'or** : en cas de doute, **utilisez des parenthèses**. Elles rendent le code plus lisible ET évitent les bugs.

> ✏️ **Exercice** : Calculez \`2 + 3 * 4 - 1\`, puis \`(2 + 3) * (4 - 1)\` et \`2 ** 3 + 4 ** 2\`. Vérifiez mentalement puis avec Python.
`, [
          {
            question: "Quel est le résultat de 2 + 3 * 4 en Python ?",
            options: [
              { text: "20", correct: false },
              { text: "14", correct: true },
              { text: "24", correct: false },
              { text: "10", correct: false },
            ]
          },
          {
            question: "Que fait l'opérateur += ?",
            options: [
              { text: "Compare deux valeurs", correct: false },
              { text: "Ajoute et réaffecte à la même variable", correct: true },
              { text: "Crée une nouvelle variable", correct: false },
              { text: "Concatène deux chaînes", correct: false },
            ]
          },
          {
            question: "Quel opérateur retourne le reste d'une division ?",
            options: [
              { text: "//", correct: false },
              { text: "/", correct: false },
              { text: "%", correct: true },
              { text: "**", correct: false },
            ]
          }
        ]),
      ]
    },

    /* ══════════════════════════════════════════
       MODULE 4 : Entrées / Sorties
    ══════════════════════════════════════════ */
    {
      title: "Module 4 — Entrées et Sorties",
      lessons: [
        lesson("La fonction print() en détail", `
## print() — Affichage avancé

### Paramètres de print()

\`\`\`python
# sep : séparateur entre les valeurs (défaut : espace)
print("Alice", "Bob", "Charlie", sep=", ")
print("2024", "01", "15", sep="-")

# end : caractère de fin (défaut : \\n)
print("Chargement", end="")
print("...", end="")
print(" OK !")
\`\`\`

\`\`\`output
Alice, Bob, Charlie
2024-01-15
Chargement... OK !
\`\`\`

### Mise en forme du texte

\`\`\`python
# Aligner des colonnes
print(f"{'Produit':<15} {'Prix':>10} {'Stock':>8}")
print("-" * 35)
print(f"{'Clavier':<15} {49.99:>10.2f} {23:>8}")
print(f"{'Souris':<15} {29.99:>10.2f} {150:>8}")
print(f"{'Écran 24\"':<15} {349.00:>10.2f} {5:>8}")
\`\`\`

\`\`\`output
Produit               Prix    Stock
-----------------------------------
Clavier             49.99       23
Souris              29.99      150
Écran 24"          349.00        5
\`\`\`

### Affichage formaté avec f-strings

\`\`\`python
valeur = 1234567.891

# Formatage des nombres
print(f"{valeur:,.2f}")         # Avec séparateur milliers
print(f"{valeur:.0f}")          # Sans décimales
print(f"{0.1234:.2%}")          # Pourcentage

# Padding
print(f"{'OK':^20}")            # Centré
print(f"{'Left':<20}|")         # Aligné à gauche
print(f"{'Right':>20}|")        # Aligné à droite
\`\`\`

\`\`\`output
1,234,567.89
1234568
12.34%
         OK         
Left                |
               Right|
\`\`\`

> 💡 La spécification de format \`:<20\` aligne à gauche sur 20 chars, \`:>20\` à droite, \`:^20\` au centre.

> ✏️ **Exercice** : Créez et affichez un tableau de multiplication de 1 à 10 avec des colonnes bien alignées.
`),

        lesson("La fonction input()", `
## input() — Saisie utilisateur

### Syntaxe de base

\`\`\`python
# Demander une saisie
prenom = input("Entrez votre prénom : ")
print(f"Bonjour, {prenom} !")
\`\`\`

\`\`\`output
Entrez votre prénom : Alice
Bonjour, Alice !
\`\`\`

### Saisie numérique

\`\`\`python
# input() retourne toujours une str → convertir !
age_str = input("Votre âge : ")
age = int(age_str)

annee_actuelle = 2024
annee_naissance = annee_actuelle - age
print(f"Vous êtes né(e) en {annee_naissance}")
print(f"Dans 10 ans, vous aurez {age + 10} ans")
\`\`\`

### Programme complet : calculatrice simple

\`\`\`python
print("=== Calculatrice Simple ===")
a = float(input("Premier nombre : "))
b = float(input("Deuxième nombre : "))

print(f"\\n{a} + {b} = {a + b}")
print(f"{a} - {b} = {a - b}")
print(f"{a} × {b} = {a * b}")

if b != 0:
    print(f"{a} ÷ {b} = {a / b:.2f}")
else:
    print("Division par zéro impossible !")
\`\`\`

\`\`\`output
=== Calculatrice Simple ===
Premier nombre : 15
Deuxième nombre : 4

15.0 + 4.0 = 19.0
15.0 - 4.0 = 11.0
15.0 × 4.0 = 60.0
15.0 ÷ 4.0 = 3.75
\`\`\`

> ⚠️ \`input()\` **attend** que l'utilisateur tape quelque chose et appuie sur Entrée. Votre programme est en pause jusqu'à cette saisie.

> ✏️ **Exercice** : Créez un convertisseur de température. L'utilisateur entre une température en Celsius et le programme affiche la valeur en Fahrenheit (formule : \`F = C * 9/5 + 32\`).
`),

        lesson("Les f-strings avancées", `
## f-strings avancées

### Rappel : f-strings de base

\`\`\`python
nom = "Python"
version = 3.12
print(f"Bienvenue dans {nom} {version}")
\`\`\`

\`\`\`output
Bienvenue dans Python 3.12
\`\`\`

### Formatage des nombres

\`\`\`python
pi = 3.14159265358979

print(f"Pi avec 2 décimales : {pi:.2f}")
print(f"Pi avec 5 décimales : {pi:.5f}")
print(f"Pi en notation scientifique : {pi:.2e}")
print(f"Grand nombre : {1_234_567:,}")
print(f"Pourcentage : {0.856:.1%}")
print(f"Entier sur 5 chiffres : {42:05d}")
\`\`\`

\`\`\`output
Pi avec 2 décimales : 3.14
Pi avec 5 décimales : 3.14159
Pi en notation scientifique : 3.14e+00
Grand nombre : 1,234,567
Pourcentage : 85.6%
Entier sur 5 chiffres : 00042
\`\`\`

### Expressions dans les f-strings

\`\`\`python
prix = 45.00
taux_remise = 0.15

print(f"Prix original : {prix:.2f} €")
print(f"Remise ({taux_remise:.0%}) : {prix * taux_remise:.2f} €")
print(f"Prix final : {prix * (1 - taux_remise):.2f} €")
\`\`\`

\`\`\`output
Prix original : 45.00 €
Remise (15%) : 6.75 €
Prix final : 38.25 €
\`\`\`

### Debug avec f-strings (Python 3.8+)

\`\`\`python
x = 42
y = 3.14
print(f"{x=}")       # Affiche nom ET valeur
print(f"{y=:.2f}")   # Avec formatage
print(f"{x + y = }") # Avec expression
\`\`\`

\`\`\`output
x=42
y=3.14
x + y = 45.14
\`\`\`

> 💡 La syntaxe \`{variable=}\` est parfaite pour le débogage : elle affiche le nom de la variable et sa valeur automatiquement.

> ✏️ **Exercice** : Créez un programme de facture qui affiche : client, liste de 3 produits avec prix, sous-total, TVA 20%, et total final — le tout proprement aligné.
`, [
          {
            question: "Comment afficher un float avec exactement 2 décimales dans une f-string ?",
            options: [
              { text: "f\"{valeur:2f}\"", correct: false },
              { text: "f\"{valeur:.2f}\"", correct: true },
              { text: "f\"{valeur,2f}\"", correct: false },
              { text: "f\"{round(valeur,2)}\"", correct: false },
            ]
          },
          {
            question: "Quel type retourne toujours input() ?",
            options: [
              { text: "int", correct: false },
              { text: "float", correct: false },
              { text: "str", correct: true },
              { text: "bool", correct: false },
            ]
          }
        ]),
      ]
    },

    /* ══════════════════════════════════════════
       MODULE 5 : Structures conditionnelles
    ══════════════════════════════════════════ */
    {
      title: "Module 5 — Structures Conditionnelles",
      lessons: [
        lesson("if / else", `
## La structure if / else

La condition \`if/else\` permet d'**exécuter du code selon une condition**.

### Syntaxe

\`\`\`python
if condition:
    # Code exécuté si condition est True
else:
    # Code exécuté si condition est False
\`\`\`

### Exemple simple

\`\`\`python
age = 20

if age >= 18:
    print("Vous êtes majeur.")
else:
    print("Vous êtes mineur.")
\`\`\`

\`\`\`output
Vous êtes majeur.
\`\`\`

### Exemple avec input

\`\`\`python
mot_de_passe = input("Entrez le mot de passe : ")

if mot_de_passe == "python123":
    print("Accès accordé !")
    print("Bienvenue dans le système.")
else:
    print("Mot de passe incorrect.")
    print("Accès refusé.")
\`\`\`

### Vérifier si un nombre est pair

\`\`\`python
n = int(input("Entrez un nombre : "))

if n % 2 == 0:
    print(f"{n} est un nombre pair.")
else:
    print(f"{n} est un nombre impair.")
\`\`\`

\`\`\`output
Entrez un nombre : 7
7 est un nombre impair.
\`\`\`

> ⚠️ L'indentation est **obligatoire** en Python ! Le bloc \`if\` et le bloc \`else\` doivent être indentés (4 espaces ou 1 tab).

> ✏️ **Exercice** : Créez un programme qui demande la note d'un étudiant (0-20) et affiche "Admis" si note >= 10, "Recalé" sinon.
`),

        lesson("elif — Conditions multiples", `
## elif — Plusieurs conditions

\`elif\` (abréviation de "else if") permet de tester **plusieurs conditions en séquence**.

### Syntaxe

\`\`\`python
if condition1:
    # Si condition1 est True
elif condition2:
    # Si condition2 est True (et condition1 est False)
elif condition3:
    # Si condition3 est True
else:
    # Si aucune condition n'est True
\`\`\`

### Exemple : mention scolaire

\`\`\`python
note = float(input("Votre note (0-20) : "))

if note >= 16:
    mention = "Très Bien"
elif note >= 14:
    mention = "Bien"
elif note >= 12:
    mention = "Assez Bien"
elif note >= 10:
    mention = "Passable"
else:
    mention = "Insuffisant"

print(f"Résultat : {mention}")
\`\`\`

\`\`\`output
Votre note (0-20) : 13.5
Résultat : Assez Bien
\`\`\`

### Exemple : tarif de cinéma

\`\`\`python
age = int(input("Âge : "))

if age < 4:
    tarif = 0
    categorie = "Gratuit"
elif age < 12:
    tarif = 6
    categorie = "Enfant"
elif age < 18:
    tarif = 8
    categorie = "Adolescent"
elif age < 65:
    tarif = 12
    categorie = "Adulte"
else:
    tarif = 8
    categorie = "Senior"

print(f"Catégorie : {categorie} — Tarif : {tarif} €")
\`\`\`

\`\`\`output
Âge : 10
Catégorie : Enfant — Tarif : 6 €
\`\`\`

> 💡 Python teste les conditions **dans l'ordre** et s'arrête à la première qui est \`True\`. L'ordre des \`elif\` est donc crucial !

> ✏️ **Exercice** : Créez un convertisseur de notes : A (>=18), B (>=14), C (>=12), D (>=10), E (>=8), F (<8).
`),

        lesson("Conditions imbriquées", `
## Conditions imbriquées

On peut mettre un \`if\` à l'intérieur d'un autre \`if\`.

### Exemple : accès à un service

\`\`\`python
age = int(input("Votre âge : "))
est_inscrit = input("Êtes-vous inscrit ? (oui/non) : ") == "oui"

if age >= 18:
    print("Vous êtes majeur.")
    if est_inscrit:
        print("Accès complet au service !")
    else:
        print("Inscrivez-vous pour accéder au service.")
else:
    print("Désolé, ce service est réservé aux majeurs.")
\`\`\`

### Exemple : système de niveau

\`\`\`python
points = int(input("Vos points : "))
abonnement = input("Premium ? (oui/non) : ") == "oui"

if points >= 1000:
    if abonnement:
        print("🏆 LÉGENDE Premium — Toutes les fonctionnalités débloquées !")
    else:
        print("🥇 LÉGENDE — Passez Premium pour plus d'avantages.")
elif points >= 500:
    if abonnement:
        print("💎 DIAMANT Premium")
    else:
        print("💎 DIAMANT")
else:
    if abonnement:
        print("⭐ Débutant Premium")
    else:
        print("⭐ Débutant")
\`\`\`

> ⚠️ Évitez les imbrications trop profondes (plus de 3 niveaux). Cela devient difficile à lire. Préférez combiner avec \`and\`/\`or\`.

\`\`\`python
# Mieux : combiner les conditions
age = 20
inscrit = True

if age >= 18 and inscrit:
    print("Accès complet !")
elif age >= 18:
    print("Inscrivez-vous !")
else:
    print("Accès refusé (mineur)")
\`\`\`

> ✏️ **Exercice** : Un parc d'attractions a des attractions pour : enfants (< 12 ans, taille >= 100 cm), adultes (>= 18 ans), ados (12-17 ans, taille >= 140 cm). Codez le système d'accès.
`),

        lesson("L'opérateur ternaire", `
## L'opérateur ternaire (expression conditionnelle)

L'opérateur ternaire permet d'écrire un \`if/else\` simple **sur une seule ligne**.

### Syntaxe

\`\`\`python
valeur = valeur_si_vrai if condition else valeur_si_faux
\`\`\`

### Exemples

\`\`\`python
age = 20

# Version longue
if age >= 18:
    statut = "majeur"
else:
    statut = "mineur"

# Version ternaire (équivalent)
statut = "majeur" if age >= 18 else "mineur"
print(f"Statut : {statut}")
\`\`\`

\`\`\`output
Statut : majeur
\`\`\`

### Utilisations pratiques

\`\`\`python
# Dans un print
n = 7
print(f"{n} est {'pair' if n % 2 == 0 else 'impair'}")

# Pour choisir une valeur
taux = 0.10 if age < 25 else 0.05
prix_base = 100
prix_final = prix_base * (1 - taux)
print(f"Réduction : {taux:.0%} | Prix final : {prix_final:.2f} €")

# Maximum de deux nombres
a, b = 42, 37
maximum = a if a > b else b
print(f"Maximum de {a} et {b} : {maximum}")
\`\`\`

\`\`\`output
7 est impair
Réduction : 10% | Prix final : 90.00 €
Maximum de 42 et 37 : 42
\`\`\`

> 💡 L'opérateur ternaire est parfait pour les cas simples. Pour les logiques complexes, utilisez un if/elif/else classique pour rester lisible.

> ✏️ **Exercice** : Utilisez l'opérateur ternaire pour écrire : "positif", "négatif" ou "zéro" selon la valeur d'un nombre entré par l'utilisateur.
`),

        lesson("Projet : Calculateur de BMI et conseils", `
## Projet — Calculateur d'IMC avec conseils

Mettons en pratique tout ce que vous avez appris dans ce module !

### Le programme complet

\`\`\`python
print("=" * 45)
print("    CALCULATEUR D'INDICE DE MASSE CORPORELLE")
print("=" * 45)

# Saisie
prenom = input("Votre prénom : ")
poids = float(input("Votre poids (kg) : "))
taille = float(input("Votre taille (m) : "))

# Calcul
imc = poids / (taille ** 2)

# Catégorie
if imc < 18.5:
    categorie = "Insuffisance pondérale"
    conseil = "Consultez un médecin et augmentez votre apport calorique."
elif imc < 25:
    categorie = "Poids normal"
    conseil = "Continuez comme ça ! Maintenez une alimentation équilibrée."
elif imc < 30:
    categorie = "Surpoids"
    conseil = "Augmentez votre activité physique et surveillez votre alimentation."
elif imc < 35:
    categorie = "Obésité modérée"
    conseil = "Consultez un professionnel de santé."
else:
    categorie = "Obésité sévère"
    conseil = "Consultez rapidement un médecin spécialiste."

# Affichage du résultat
print(f"\\n{'─' * 45}")
print(f"  Résultats pour {prenom}")
print(f"{'─' * 45}")
print(f"  Poids    : {poids} kg")
print(f"  Taille   : {taille} m")
print(f"  IMC      : {imc:.1f}")
print(f"  Catégorie: {categorie}")
print(f"{'─' * 45}")
print(f"  💡 Conseil : {conseil}")
print(f"{'─' * 45}")
\`\`\`

\`\`\`output
=============================================
    CALCULATEUR D'INDICE DE MASSE CORPORELLE
=============================================
Votre prénom : Alice
Votre poids (kg) : 62
Votre taille (m) : 1.68
─────────────────────────────────────────────
  Résultats pour Alice
─────────────────────────────────────────────
  Poids    : 62.0 kg
  Taille   : 1.68 m
  IMC      : 22.0
  Catégorie: Poids normal
─────────────────────────────────────────────
  💡 Conseil : Continuez comme ça ! Maintenez une alimentation équilibrée.
─────────────────────────────────────────────
\`\`\`

> ✏️ **Améliorations possibles** : Ajoutez le calcul du poids idéal, affichez une barre de progression visuelle de l'IMC, ou ajoutez une validation pour rejeter des valeurs impossibles (taille < 0.5m, poids > 500kg).
`, [
          {
            question: "Quelle est la syntaxe de l'opérateur ternaire en Python ?",
            options: [
              { text: "condition ? valeur_vrai : valeur_faux", correct: false },
              { text: "valeur_vrai if condition else valeur_faux", correct: true },
              { text: "if condition then valeur_vrai else valeur_faux", correct: false },
              { text: "condition and valeur_vrai or valeur_faux", correct: false },
            ]
          },
          {
            question: "En Python, l'indentation est :",
            options: [
              { text: "Optionnelle mais recommandée", correct: false },
              { text: "Obligatoire pour la syntaxe", correct: true },
              { text: "Uniquement pour les commentaires", correct: false },
              { text: "Réservée aux fonctions", correct: false },
            ]
          },
          {
            question: "Combien de blocs elif peut-on avoir après un if ?",
            options: [
              { text: "Maximum 1", correct: false },
              { text: "Maximum 3", correct: false },
              { text: "Autant qu'on veut", correct: true },
              { text: "Maximum 10", correct: false },
            ]
          }
        ]),
      ]
    },

    /* ══════════════════════════════════════════
       MODULE 6 : Boucles
    ══════════════════════════════════════════ */
    {
      title: "Module 6 — Boucles et Itérations",
      lessons: [
        lesson("La boucle while", `
## La boucle while

La boucle \`while\` répète un bloc de code **tant qu'une condition est vraie**.

### Syntaxe

\`\`\`python
while condition:
    # Code répété tant que condition est True
\`\`\`

### Exemple : compte à rebours

\`\`\`python
compteur = 5

while compteur > 0:
    print(f"⏱️ {compteur}...")
    compteur -= 1

print("🚀 Décollage !")
\`\`\`

\`\`\`output
⏱️ 5...
⏱️ 4...
⏱️ 3...
⏱️ 2...
⏱️ 1...
🚀 Décollage !
\`\`\`

### Validation de saisie

\`\`\`python
# Répéter jusqu'à une saisie valide
age = -1
while age < 0 or age > 150:
    age = int(input("Entrez votre âge (0-150) : "))
    if age < 0 or age > 150:
        print("Age invalide, réessayez.")

print(f"Âge valide : {age} ans")
\`\`\`

### Accumulateur

\`\`\`python
# Calculer la somme des nombres de 1 à N
n = int(input("Calculer la somme de 1 à N : "))
somme = 0
i = 1

while i <= n:
    somme += i
    i += 1

print(f"Somme de 1 à {n} = {somme}")
\`\`\`

\`\`\`output
Calculer la somme de 1 à N : 10
Somme de 1 à 10 = 55
\`\`\`

> ⚠️ **Boucle infinie** : Si la condition ne devient jamais \`False\`, la boucle tourne indéfiniment. Vérifiez toujours que votre condition peut devenir \`False\`. Utilisez Ctrl+C pour stopper une boucle infinie.

> ✏️ **Exercice** : Créez un jeu de devinette : l'ordinateur choisit un nombre entre 1 et 20 (\`import random; nombre = random.randint(1, 20)\`), et l'utilisateur doit le trouver. Indiquez "trop grand" ou "trop petit" à chaque essai.
`),

        lesson("La boucle for", `
## La boucle for

La boucle \`for\` itère sur une **séquence** (liste, chaîne, range, etc.).

### Itérer sur une liste

\`\`\`python
fruits = ["pomme", "banane", "cerise", "datte"]

for fruit in fruits:
    print(f"🍎 J'aime les {fruit}s")
\`\`\`

\`\`\`output
🍎 J'aime les pommes
🍎 J'aime les bananes
🍎 J'aime les cerises
🍎 J'aime les dattes
\`\`\`

### Itérer sur une chaîne

\`\`\`python
mot = "Python"
for lettre in mot:
    print(lettre, end="-")
print()  # Saut de ligne final
\`\`\`

\`\`\`output
P-y-t-h-o-n-
\`\`\`

### Avec enumerate() — index + valeur

\`\`\`python
langages = ["Python", "JavaScript", "Java", "C++"]

for i, langage in enumerate(langages, start=1):
    print(f"{i}. {langage}")
\`\`\`

\`\`\`output
1. Python
2. JavaScript
3. Java
4. C++
\`\`\`

### Calculer la somme d'une liste

\`\`\`python
notes = [14, 16, 11, 18, 13, 15]
total = 0

for note in notes:
    total += note

moyenne = total / len(notes)
print(f"Nombre de notes : {len(notes)}")
print(f"Total : {total}")
print(f"Moyenne : {moyenne:.2f}/20")
\`\`\`

\`\`\`output
Nombre de notes : 6
Total : 87
Moyenne : 14.50/20
\`\`\`

> 💡 Pour la somme et la moyenne, Python propose les fonctions intégrées \`sum()\`, \`min()\`, \`max()\` qui sont encore plus concises.

> ✏️ **Exercice** : Créez une liste de 5 températures. Calculez et affichez la moyenne, la température max et la température min.
`),

        lesson("La fonction range()", `
## La fonction range()

\`range()\` génère une séquence de nombres, parfaite pour les boucles \`for\`.

### Les trois formes de range()

\`\`\`python
# range(stop) → 0 à stop-1
for i in range(5):
    print(i, end=" ")
print()

# range(start, stop) → start à stop-1
for i in range(2, 8):
    print(i, end=" ")
print()

# range(start, stop, step) → avec pas
for i in range(0, 20, 3):
    print(i, end=" ")
print()

# Décompte (pas négatif)
for i in range(10, 0, -2):
    print(i, end=" ")
print()
\`\`\`

\`\`\`output
0 1 2 3 4 
2 3 4 5 6 7 
0 3 6 9 12 15 18 
10 8 6 4 2 
\`\`\`

### Table de multiplication

\`\`\`python
n = int(input("Table de multiplication de : "))

print(f"\\n  Table de {n}")
print("  " + "─" * 20)
for i in range(1, 11):
    print(f"  {n} × {i:2d} = {n * i:3d}")
\`\`\`

\`\`\`output
  Table de 7
  ────────────────────
  7 ×  1 =   7
  7 ×  2 =  14
  7 ×  3 =  21
  7 ×  4 =  28
  7 ×  5 =  35
  7 ×  6 =  42
  7 ×  7 =  49
  7 ×  8 =  56
  7 ×  9 =  63
  7 × 10 =  70
\`\`\`

### Somme avec range()

\`\`\`python
# Somme des 100 premiers entiers
total = sum(range(1, 101))
print(f"1 + 2 + ... + 100 = {total}")

# Nombres pairs de 0 à 20
pairs = list(range(0, 21, 2))
print(f"Pairs de 0 à 20 : {pairs}")
\`\`\`

\`\`\`output
1 + 2 + ... + 100 = 5050
Pairs de 0 à 20 : [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
\`\`\`

> 💡 \`range()\` ne crée pas une liste en mémoire : elle génère les nombres à la demande. C'est très efficace pour les grands intervalles.

> ✏️ **Exercice** : Affichez tous les multiples de 7 entre 1 et 100, puis comptez combien il y en a.
`),

        lesson("break, continue et else", `
## break, continue et else dans les boucles

### L'instruction \`break\`

\`break\` **arrête immédiatement** la boucle.

\`\`\`python
# Chercher le premier nombre divisible par 7
for n in range(1, 100):
    if n % 7 == 0:
        print(f"Premier multiple de 7 : {n}")
        break
\`\`\`

\`\`\`output
Premier multiple de 7 : 7
\`\`\`

### L'instruction \`continue\`

\`continue\` **saute l'itération courante** et passe à la suivante.

\`\`\`python
# Afficher les nombres de 1 à 10 sauf les multiples de 3
for n in range(1, 11):
    if n % 3 == 0:
        continue
    print(n, end=" ")
print()
\`\`\`

\`\`\`output
1 2 4 5 7 8 10 
\`\`\`

### La clause \`else\` des boucles

Le bloc \`else\` s'exécute **si la boucle se termine normalement** (sans \`break\`).

\`\`\`python
# Chercher si un nombre est premier
n = 17

for i in range(2, n):
    if n % i == 0:
        print(f"{n} n'est PAS premier (divisible par {i})")
        break
else:
    print(f"{n} est un nombre PREMIER !")
\`\`\`

\`\`\`output
17 est un nombre PREMIER !
\`\`\`

### Application : jeu de recherche

\`\`\`python
recherche = "banane"
panier = ["pomme", "cerise", "orange", "raisin"]

for fruit in panier:
    if fruit == recherche:
        print(f"✅ '{recherche}' trouvé dans le panier !")
        break
else:
    print(f"❌ '{recherche}' n'est pas dans le panier.")
\`\`\`

\`\`\`output
❌ 'banane' n'est pas dans le panier.
\`\`\`

> 💡 Le \`else\` d'une boucle est peu connu mais très puissant pour les algorithmes de recherche : il s'exécute uniquement si aucun \`break\` n'a eu lieu.

> ✏️ **Exercice** : Écrivez un programme qui demande des nombres à l'utilisateur jusqu'à ce qu'il tape 0, et affiche ensuite la somme, la moyenne, le minimum et le maximum.
`),

        lesson("Boucles imbriquées", `
## Boucles imbriquées

Une boucle à l'intérieur d'une autre boucle.

### Exemple : table de multiplication complète

\`\`\`python
# En-tête
print("    ", end="")
for j in range(1, 6):
    print(f"{j:4d}", end="")
print()
print("    " + "─" * 20)

# Corps
for i in range(1, 6):
    print(f"{i:3d} |", end="")
    for j in range(1, 6):
        print(f"{i*j:4d}", end="")
    print()
\`\`\`

\`\`\`output
       1   2   3   4   5
    ────────────────────
  1 |   1   2   3   4   5
  2 |   2   4   6   8  10
  3 |   3   6   9  12  15
  4 |   4   8  12  16  20
  5 |   5  10  15  20  25
\`\`\`

### Exemple : motif en étoiles

\`\`\`python
# Triangle d'étoiles
lignes = 6
for i in range(1, lignes + 1):
    for j in range(i):
        print("★", end=" ")
    print()
\`\`\`

\`\`\`output
★ 
★ ★ 
★ ★ ★ 
★ ★ ★ ★ 
★ ★ ★ ★ ★ 
★ ★ ★ ★ ★ ★ 
\`\`\`

### Chercher dans une grille

\`\`\`python
grille = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

cible = 5
for ligne in range(len(grille)):
    for col in range(len(grille[ligne])):
        if grille[ligne][col] == cible:
            print(f"Trouvé {cible} à la ligne {ligne}, colonne {col}")
\`\`\`

\`\`\`output
Trouvé 5 à la ligne 1, colonne 1
\`\`\`

> ⚠️ Les boucles imbriquées peuvent être lentes pour de grandes données. Si vous avez 3 niveaux d'imbrication ou plus, repensez votre algorithme.

> ✏️ **Exercice** : Affichez un carré de N×N de nombres, où chaque case contient le produit de sa ligne et de sa colonne (N saisi par l'utilisateur).
`),

        lesson("Projet : Jeu du nombre mystère", `
## Projet — Jeu du Nombre Mystère

Créons un jeu complet avec les boucles !

### Le programme

\`\`\`python
import random

print("=" * 40)
print("     JEU DU NOMBRE MYSTÈRE")
print("=" * 40)
print("Je pense à un nombre entre 1 et 100.")
print("Vous avez 7 essais pour le trouver !")
print()

# Paramètres
nombre_secret = random.randint(1, 100)
max_essais = 7
essais_restants = max_essais
gagne = False

while essais_restants > 0:
    print(f"Essais restants : {essais_restants}")
    
    # Saisie sécurisée
    while True:
        try:
            proposition = int(input("Votre proposition : "))
            if 1 <= proposition <= 100:
                break
            print("Entrez un nombre entre 1 et 100 !")
        except ValueError:
            print("Entrez un nombre valide !")
    
    essais_restants -= 1
    
    if proposition == nombre_secret:
        gagne = True
        break
    elif proposition < nombre_secret:
        diff = nombre_secret - proposition
        if diff > 20:
            print("❄️ Beaucoup trop petit !")
        elif diff > 5:
            print("⬆️ Trop petit.")
        else:
            print("🔥 Tout près ! Un peu plus grand.")
    else:
        diff = proposition - nombre_secret
        if diff > 20:
            print("❄️ Beaucoup trop grand !")
        elif diff > 5:
            print("⬇️ Trop grand.")
        else:
            print("🔥 Tout près ! Un peu plus petit.")
    print()

# Résultat final
print("=" * 40)
if gagne:
    essais_utilises = max_essais - essais_restants
    print(f"🎉 BRAVO ! Vous avez trouvé {nombre_secret} !")
    print(f"   en {essais_utilises} essai(s) seulement !")
else:
    print(f"😅 Perdu... Le nombre était {nombre_secret}.")
    print("Retentez votre chance !")
print("=" * 40)
\`\`\`

> ✏️ **Améliorations** : Ajoutez un système de score basé sur le nombre d'essais, proposez de rejouer, ou rendez le niveau de difficulté configurable (facile: 1-50, normal: 1-100, difficile: 1-200).
`, [
          {
            question: "Que fait l'instruction 'break' dans une boucle ?",
            options: [
              { text: "Saute l'itération courante", correct: false },
              { text: "Arrête immédiatement la boucle", correct: true },
              { text: "Recommence la boucle depuis le début", correct: false },
              { text: "Répète l'itération courante", correct: false },
            ]
          },
          {
            question: "range(2, 10, 2) génère :",
            options: [
              { text: "2, 4, 6, 8, 10", correct: false },
              { text: "2, 4, 6, 8", correct: true },
              { text: "2, 4, 6", correct: false },
              { text: "0, 2, 4, 6, 8", correct: false },
            ]
          },
          {
            question: "Quand s'exécute le bloc 'else' d'une boucle for ?",
            options: [
              { text: "Si la boucle ne s'exécute pas du tout", correct: false },
              { text: "Si une erreur survient", correct: false },
              { text: "Si la boucle se termine sans 'break'", correct: true },
              { text: "Toujours après la boucle", correct: false },
            ]
          }
        ]),
      ]
    },

    /* ══════════════════════════════════════════
       MODULE 7 : Fonctions
    ══════════════════════════════════════════ */
    {
      title: "Module 7 — Fonctions",
      lessons: [
        lesson("Définir et appeler une fonction", `
## Les fonctions

Une **fonction** est un bloc de code réutilisable, identifié par un nom.

### Pourquoi utiliser des fonctions ?

- **Réutilisabilité** : écrire le code une fois, l'utiliser partout
- **Lisibilité** : diviser un programme complexe en petits morceaux
- **Maintenance** : corriger un bug à un seul endroit

### Syntaxe de base

\`\`\`python
def nom_fonction():
    # Corps de la fonction
    print("Je suis une fonction !")

# Appeler la fonction
nom_fonction()
nom_fonction()  # On peut l'appeler autant de fois qu'on veut
\`\`\`

\`\`\`output
Je suis une fonction !
Je suis une fonction !
\`\`\`

### Exemple pratique

\`\`\`python
def afficher_bienvenue():
    print("=" * 30)
    print("  Bienvenue dans notre app !")
    print("=" * 30)

def afficher_au_revoir():
    print("Merci d'avoir utilisé notre app.")
    print("À bientôt !")

# Programme principal
afficher_bienvenue()
print("\\n  [Menu principal]\\n")
afficher_au_revoir()
\`\`\`

\`\`\`output
==============================
  Bienvenue dans notre app !
==============================

  [Menu principal]

Merci d'avoir utilisé notre app.
À bientôt !
\`\`\`

> 💡 En Python, la convention est de nommer les fonctions en **snake_case** : \`calculer_moyenne\`, \`afficher_menu\`, \`verifier_age\`.

> ✏️ **Exercice** : Créez une fonction \`afficher_etoiles()\` qui affiche une ligne de 20 étoiles, et une fonction \`afficher_titre(texte)\` qui affiche un titre entouré d'étoiles.
`),

        lesson("Paramètres et arguments", `
## Paramètres et arguments

Les **paramètres** permettent de passer des données à une fonction.

### Paramètres simples

\`\`\`python
def saluer(prenom):
    print(f"Bonjour, {prenom} !")

saluer("Alice")
saluer("Bob")
saluer("Charlie")
\`\`\`

\`\`\`output
Bonjour, Alice !
Bonjour, Bob !
Bonjour, Charlie !
\`\`\`

### Plusieurs paramètres

\`\`\`python
def calculer_aire_rectangle(longueur, largeur):
    aire = longueur * largeur
    print(f"Aire du rectangle {longueur}×{largeur} = {aire} cm²")

calculer_aire_rectangle(5, 3)
calculer_aire_rectangle(10, 7)
\`\`\`

\`\`\`output
Aire du rectangle 5×3 = 15 cm²
Aire du rectangle 10×7 = 70 cm²
\`\`\`

### Arguments nommés

\`\`\`python
def creer_profil(prenom, age, ville):
    print(f"👤 {prenom} | {age} ans | {ville}")

# Ordre libre avec les arguments nommés
creer_profil(age=25, ville="Paris", prenom="Alice")
creer_profil("Bob", ville="Lyon", age=30)
\`\`\`

\`\`\`output
👤 Alice | 25 ans | Paris
👤 Bob | 30 ans | Lyon
\`\`\`

> 💡 Différence importante : les **paramètres** sont dans la définition (\`def ma_fonction(parametre)\`), les **arguments** sont les valeurs passées lors de l'appel (\`ma_fonction(valeur)\`).

> ✏️ **Exercice** : Créez une fonction \`convertir_temperature(valeur, unite)\` qui convertit de Celsius en Fahrenheit (si unite="C") ou de Fahrenheit en Celsius (si unite="F").
`),

        lesson("Valeurs de retour avec return", `
## La valeur de retour — return

\`return\` permet à une fonction de **renvoyer un résultat**.

### Syntaxe

\`\`\`python
def addition(a, b):
    return a + b

# Stocker le résultat dans une variable
resultat = addition(5, 3)
print(resultat)

# Utiliser directement le résultat
print(addition(10, 20))
print(f"5 + 3 = {addition(5, 3)}")
\`\`\`

\`\`\`output
8
30
5 + 3 = 8
\`\`\`

### Fonctions mathématiques

\`\`\`python
import math

def aire_cercle(rayon):
    return math.pi * rayon ** 2

def hypotenuse(a, b):
    return math.sqrt(a**2 + b**2)

def pourcentage(valeur, total):
    return (valeur / total) * 100

print(f"Aire cercle r=5 : {aire_cercle(5):.2f} cm²")
print(f"Hypoténuse 3,4  : {hypotenuse(3, 4):.1f}")
print(f"14/20 = {pourcentage(14, 20):.1f}%")
\`\`\`

\`\`\`output
Aire cercle r=5 : 78.54 cm²
Hypoténuse 3,4  : 5.0
14/20 = 70.0%
\`\`\`

### Retourner plusieurs valeurs

\`\`\`python
def statistiques(nombres):
    return min(nombres), max(nombres), sum(nombres) / len(nombres)

notes = [12, 15, 8, 18, 11, 14]
minimum, maximum, moyenne = statistiques(notes)

print(f"Min : {minimum} | Max : {maximum} | Moyenne : {moyenne:.1f}")
\`\`\`

\`\`\`output
Min : 8 | Max : 18 | Moyenne : 13.0
\`\`\`

> 💡 Une fonction sans \`return\` renvoie implicitement \`None\`. \`return\` sans valeur renvoie aussi \`None\`.

> ✏️ **Exercice** : Créez une fonction \`analyse_texte(texte)\` qui retourne : le nombre de mots, le nombre de caractères, et le nombre de voyelles.
`),

        lesson("Valeurs par défaut des paramètres", `
## Paramètres avec valeurs par défaut

On peut définir une **valeur par défaut** pour un paramètre — il devient optionnel.

### Syntaxe

\`\`\`python
def saluer(prenom, message="Bonjour"):
    print(f"{message}, {prenom} !")

saluer("Alice")                      # Utilise la valeur par défaut
saluer("Bob", "Bonsoir")            # Remplace la valeur par défaut
saluer("Charlie", message="Salut") # Argument nommé
\`\`\`

\`\`\`output
Bonjour, Alice !
Bonsoir, Bob !
Salut, Charlie !
\`\`\`

### Application pratique

\`\`\`python
def afficher_tableau(donnees, titre="Tableau", separateur="─"):
    largeur = max(len(titre), max(len(str(d)) for d in donnees)) + 4
    
    print(f"  {titre}")
    print("  " + separateur * largeur)
    for i, item in enumerate(donnees, 1):
        print(f"  {i:2d}. {item}")
    print("  " + separateur * largeur)

# Avec valeurs par défaut
afficher_tableau(["Alice", "Bob", "Charlie"])

# Personnalisé
afficher_tableau([100, 200, 350], titre="Prix (€)", separateur="=")
\`\`\`

\`\`\`output
  Tableau
  ───────────────────────
   1. Alice
   2. Bob
   3. Charlie
  ───────────────────────
  Prix (€)
  =======================
   1. 100
   2. 200
   3. 350
  =======================
\`\`\`

> ⚠️ Les paramètres avec valeurs par défaut doivent toujours venir **après** les paramètres sans valeur par défaut. \`def f(a, b=10)\` ✅ | \`def f(a=10, b)\` ❌

> ✏️ **Exercice** : Créez une fonction \`tracer_ligne(caractere='-', longueur=40)\` et testez-la avec différentes combinaisons d'arguments.
`),

        lesson("*args et **kwargs", `
## *args et **kwargs — Paramètres flexibles

### *args — Nombre variable de positionnels

\`\`\`python
def additionner(*nombres):
    print(f"Paramètres reçus : {nombres}")
    return sum(nombres)

print(additionner(1, 2))
print(additionner(1, 2, 3, 4, 5))
print(additionner(10, 20, 30, 40, 50, 60))
\`\`\`

\`\`\`output
Paramètres reçus : (1, 2)
Paramètres reçus : (1, 2, 3, 4, 5)
Paramètres reçus : (10, 20, 30, 40, 50, 60)
3
15
210
\`\`\`

### **kwargs — Nombre variable de nommés

\`\`\`python
def afficher_profil(**infos):
    print("📋 Profil :")
    for cle, valeur in infos.items():
        print(f"  {cle}: {valeur}")

afficher_profil(prenom="Alice", age=25, ville="Paris", job="Dev")
\`\`\`

\`\`\`output
📋 Profil :
  prenom: Alice
  age: 25
  ville: Paris
  job: Dev
\`\`\`

### Combinaison complète

\`\`\`python
def ma_fonction(obligatoire, *args, defaut="valeur", **kwargs):
    print(f"Obligatoire : {obligatoire}")
    print(f"Args : {args}")
    print(f"Défaut : {defaut}")
    print(f"Kwargs : {kwargs}")

ma_fonction("important", 1, 2, 3, defaut="custom", x=10, y=20)
\`\`\`

\`\`\`output
Obligatoire : important
Args : (1, 2, 3)
Défaut : custom
Kwargs : {'x': 10, 'y': 20}
\`\`\`

> 💡 \`*args\` → tuple. \`**kwargs\` → dictionnaire. On peut utiliser n'importe quel nom (ex: \`*params\`, \`**options\`), mais \`args\` et \`kwargs\` sont les conventions standard.

> ✏️ **Exercice** : Créez une fonction \`calculer_note_finale(*notes, bonus=0)\` qui calcule la moyenne des notes et ajoute le bonus optionnel.
`),

        lesson("Les fonctions lambda", `
## Les fonctions lambda

Une **fonction lambda** est une fonction anonyme, sur une seule ligne.

### Syntaxe

\`\`\`python
lambda paramètres: expression
\`\`\`

### Comparaison : def vs lambda

\`\`\`python
# Avec def
def doubler(x):
    return x * 2

# Avec lambda (équivalent)
doubler_lambda = lambda x: x * 2

print(doubler(5))
print(doubler_lambda(5))
\`\`\`

\`\`\`output
10
10
\`\`\`

### Cas d'usage : tri personnalisé

\`\`\`python
etudiants = [
    {"nom": "Alice", "note": 15},
    {"nom": "Bob", "note": 12},
    {"nom": "Charlie", "note": 18},
    {"nom": "Diana", "note": 14},
]

# Trier par note croissante
tries = sorted(etudiants, key=lambda e: e["note"])
for e in tries:
    print(f"{e['nom']}: {e['note']}/20")
\`\`\`

\`\`\`output
Bob: 12/20
Diana: 14/20
Alice: 15/20
Charlie: 18/20
\`\`\`

### Avec map() et filter()

\`\`\`python
nombres = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# map() : appliquer une fonction à chaque élément
carres = list(map(lambda x: x**2, nombres))
print("Carrés :", carres)

# filter() : garder les éléments qui satisfont une condition
pairs = list(filter(lambda x: x % 2 == 0, nombres))
print("Pairs :", pairs)
\`\`\`

\`\`\`output
Carrés : [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]
Pairs : [2, 4, 6, 8, 10]
\`\`\`

> 💡 Les lambdas sont parfaites pour les fonctions courtes utilisées une seule fois (tri, map, filter). Pour les fonctions réutilisables ou complexes, utilisez \`def\`.

> ✏️ **Exercice** : Triez une liste de mots par longueur (croissant), puis par ordre alphabétique pour les mots de même longueur.
`),

        lesson("Portée des variables (scope)", `
## La portée des variables

La **portée** (scope) définit où une variable est accessible dans le code.

### Variables locales vs globales

\`\`\`python
# Variable GLOBALE : définie hors des fonctions
message_global = "Je suis global"

def ma_fonction():
    # Variable LOCALE : définie dans la fonction
    message_local = "Je suis local"
    print(message_global)   # Peut lire les globales
    print(message_local)    # Peut lire les locales

ma_fonction()
print(message_global)  # OK
# print(message_local)  # NameError ! locale inaccessible
\`\`\`

\`\`\`output
Je suis global
Je suis local
Je suis global
\`\`\`

### Modifier une variable globale

\`\`\`python
compteur = 0

def incrementer():
    global compteur  # Déclare qu'on veut modifier la globale
    compteur += 1
    print(f"Compteur : {compteur}")

incrementer()
incrementer()
incrementer()
\`\`\`

\`\`\`output
Compteur : 1
Compteur : 2
Compteur : 3
\`\`\`

### Bonne pratique : préférez les paramètres/return

\`\`\`python
# ❌ Mauvaise pratique : utiliser global
total = 0
def ajouter_mauvais(n):
    global total
    total += n

# ✅ Bonne pratique : paramètre + return
def ajouter_bon(total_actuel, n):
    return total_actuel + n

total = 0
total = ajouter_bon(total, 10)
total = ajouter_bon(total, 25)
print(total)
\`\`\`

\`\`\`output
35
\`\`\`

> ⚠️ L'utilisation de \`global\` est généralement un mauvais signe. Préférez passer les données en paramètres et les retourner avec \`return\`.

> ✏️ **Exercice** : Créez une mini-calculatrice avec 4 fonctions (\`additionner\`, \`soustraire\`, \`multiplier\`, \`diviser\`), chacune prenant 2 paramètres et retournant le résultat. Créez ensuite une fonction \`menu\` qui demande l'opération à effectuer.
`, [
          {
            question: "Quelle est la syntaxe correcte d'une fonction lambda qui double une valeur ?",
            options: [
              { text: "lambda(x): x * 2", correct: false },
              { text: "lambda x: x * 2", correct: true },
              { text: "def lambda x: x * 2", correct: false },
              { text: "lambda x => x * 2", correct: false },
            ]
          },
          {
            question: "Que retourne une fonction Python sans instruction return ?",
            options: [
              { text: "0", correct: false },
              { text: "False", correct: false },
              { text: "None", correct: true },
              { text: "Une erreur", correct: false },
            ]
          },
          {
            question: "Qu'est-ce que *args dans une définition de fonction ?",
            options: [
              { text: "Un argument obligatoire avec étoile", correct: false },
              { text: "Un nombre variable d'arguments positionnels (tuple)", correct: true },
              { text: "Un argument nommé spécial", correct: false },
              { text: "Un dictionnaire d'arguments", correct: false },
            ]
          }
        ]),
      ]
    },

    /* ══════════════════════════════════════════
       MODULE 8 : Listes
    ══════════════════════════════════════════ */
    {
      title: "Module 8 — Listes",
      lessons: [
        lesson("Créer et accéder aux listes", `
## Les listes

Une **liste** est une collection ordonnée et modifiable d'éléments.

### Créer une liste

\`\`\`python
# Liste de chaînes
fruits = ["pomme", "banane", "cerise"]

# Liste de nombres
notes = [14, 16, 11, 18]

# Liste mixte
profil = ["Alice", 25, True, 1.68]

# Liste vide
panier = []

print(fruits)
print(type(fruits))
print(len(fruits))
\`\`\`

\`\`\`output
['pomme', 'banane', 'cerise']
<class 'list'>
3
\`\`\`

### Accès par index

\`\`\`python
fruits = ["pomme", "banane", "cerise", "datte", "figue"]

# Index positif (commence à 0)
print(fruits[0])    # Premier
print(fruits[2])    # Troisième

# Index négatif (depuis la fin)
print(fruits[-1])   # Dernier
print(fruits[-2])   # Avant-dernier
\`\`\`

\`\`\`output
pomme
cerise
figue
datte
\`\`\`

### Slicing (découpage)

\`\`\`python
nombres = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

print(nombres[2:6])     # Du 3ème au 6ème
print(nombres[:4])      # Du début au 4ème
print(nombres[6:])      # Du 7ème à la fin
print(nombres[::2])     # Un sur deux
print(nombres[::-1])    # Inversé !
\`\`\`

\`\`\`output
[2, 3, 4, 5]
[0, 1, 2, 3]
[6, 7, 8, 9]
[0, 2, 4, 6, 8]
[9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
\`\`\`

> 💡 Les index de listes commencent à **0**. Le dernier élément a l'index \`len(liste) - 1\` ou simplement \`-1\`.

> ✏️ **Exercice** : Créez une liste de 7 jours de la semaine. Affichez le premier, le dernier, les 3 premiers et les jours ouvrables (lundi à vendredi).
`),

        lesson("Modifier une liste", `
## Modifier une liste

Les listes sont **mutables** — on peut les modifier après création.

### Modifier un élément

\`\`\`python
courses = ["pain", "lait", "beurre", "fromage"]
print("Avant :", courses)

courses[1] = "yaourt"  # Remplacer "lait" par "yaourt"
print("Après :", courses)
\`\`\`

\`\`\`output
Avant : ['pain', 'lait', 'beurre', 'fromage']
Après : ['pain', 'yaourt', 'beurre', 'fromage']
\`\`\`

### Ajouter des éléments

\`\`\`python
panier = []

panier.append("pomme")        # Ajouter à la fin
panier.append("banane")
panier.insert(0, "ananas")    # Insérer à la position 0

print(panier)
\`\`\`

\`\`\`output
['ananas', 'pomme', 'banane']
\`\`\`

### Supprimer des éléments

\`\`\`python
liste = [10, 20, 30, 40, 50]

liste.remove(30)          # Supprimer par valeur
print(liste)

dernier = liste.pop()     # Supprimer et retourner le dernier
print(f"Retiré : {dernier} | Reste : {liste}")

element = liste.pop(0)    # Supprimer à l'index 0
print(f"Retiré : {element} | Reste : {liste}")

del liste[0]              # Supprimer à l'index
print(liste)
\`\`\`

\`\`\`output
[10, 20, 40, 50]
Retiré : 50 | Reste : [10, 20, 40]
Retiré : 10 | Reste : [20, 40]
[40]
\`\`\`

### Étendre une liste

\`\`\`python
liste1 = [1, 2, 3]
liste2 = [4, 5, 6]

# extend() : ajouter tous les éléments
liste1.extend(liste2)
print(liste1)

# Opérateur + : crée une nouvelle liste
combinee = [1, 2] + [3, 4] + [5, 6]
print(combinee)
\`\`\`

\`\`\`output
[1, 2, 3, 4, 5, 6]
[1, 2, 3, 4, 5, 6]
\`\`\`

> ✏️ **Exercice** : Créez un gestionnaire de tâches simple. L'utilisateur peut ajouter des tâches, en supprimer et les afficher, via un menu en boucle.
`),

        lesson("Méthodes des listes", `
## Les méthodes des listes

Python offre de nombreuses méthodes pour manipuler les listes.

### Tableau des méthodes essentielles

\`\`\`python
nombres = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]

print(f"Liste : {nombres}")
print(f"Longueur : {len(nombres)}")
print(f"Somme : {sum(nombres)}")
print(f"Min : {min(nombres)}")
print(f"Max : {max(nombres)}")
print(f"Compte de 5 : {nombres.count(5)}")
print(f"Index de 9 : {nombres.index(9)}")
\`\`\`

\`\`\`output
Liste : [3, 1, 4, 1, 5, 9, 2, 6, 5, 3]
Longueur : 10
Somme : 39
Min : 1
Max : 9
Compte de 5 : 2
Index de 9 : 5
\`\`\`

### Trier et inverser

\`\`\`python
notes = [14, 8, 18, 11, 16, 12]

# sort() modifie la liste en place
notes.sort()
print("Croissant :", notes)

notes.sort(reverse=True)
print("Décroissant :", notes)

# sorted() crée une nouvelle liste
originale = [5, 2, 8, 1, 9]
triee = sorted(originale)
print(f"Originale : {originale} | Triée : {triee}")

# reverse() inverse en place
liste = [1, 2, 3, 4, 5]
liste.reverse()
print("Inversée :", liste)
\`\`\`

\`\`\`output
Croissant : [8, 11, 12, 14, 16, 18]
Décroissant : [18, 16, 14, 12, 11, 8]
Originale : [5, 2, 8, 1, 9] | Triée : [1, 2, 5, 8, 9]
Inversée : [5, 4, 3, 2, 1]
\`\`\`

### Vérifier l'appartenance

\`\`\`python
fruits = ["pomme", "banane", "cerise"]

print("banane" in fruits)     # True
print("mangue" in fruits)     # False
print("mangue" not in fruits) # True
\`\`\`

\`\`\`output
True
False
True
\`\`\`

> 💡 Utilisez \`in\` pour vérifier si un élément est dans une liste — c'est bien plus lisible que de faire une boucle !

> ✏️ **Exercice** : Créez une liste de 10 notes aléatoires (entre 0 et 20) avec \`random.randint\`. Affichez la liste triée, la moyenne, les admis (>= 10) et les recalés.
`),

        lesson("Les list comprehensions", `
## List Comprehensions

Les **list comprehensions** permettent de créer des listes de façon concise et élégante.

### Syntaxe

\`\`\`python
[expression for element in iterable if condition]
\`\`\`

### Exemples de base

\`\`\`python
# Traditionnel
carres = []
for x in range(1, 6):
    carres.append(x**2)
print(carres)

# List comprehension (équivalent)
carres = [x**2 for x in range(1, 6)]
print(carres)

# Avec condition
pairs_carres = [x**2 for x in range(1, 11) if x % 2 == 0]
print(pairs_carres)
\`\`\`

\`\`\`output
[1, 4, 9, 16, 25]
[1, 4, 9, 16, 25]
[4, 16, 36, 64, 100]
\`\`\`

### Exemples pratiques

\`\`\`python
# Mettre en majuscules
mots = ["python", "est", "génial"]
majuscules = [mot.upper() for mot in mots]
print(majuscules)

# Filtrer les admis
notes = [8, 14, 7, 16, 11, 5, 18, 9]
admis = [n for n in notes if n >= 10]
refusés = [n for n in notes if n < 10]
print(f"Admis : {admis}")
print(f"Refusés : {refusés}")

# Transformer
celsius = [0, 20, 37, 100]
fahrenheit = [c * 9/5 + 32 for c in celsius]
print(list(zip(celsius, fahrenheit)))
\`\`\`

\`\`\`output
['PYTHON', 'EST', 'GÉNIAL']
Admis : [14, 16, 11, 18]
Refusés : [8, 7, 5, 9]
[(0, 32.0), (20, 68.0), (37, 98.6), (100, 212.0)]
\`\`\`

### List comprehension imbriquée

\`\`\`python
# Matrice 3×3
matrice = [[i * j for j in range(1, 4)] for i in range(1, 4)]
for ligne in matrice:
    print(ligne)
\`\`\`

\`\`\`output
[1, 2, 3]
[2, 4, 6]
[3, 6, 9]
\`\`\`

> 💡 Les list comprehensions sont une des fonctionnalités les plus appréciées de Python. Elles sont généralement plus rapides que les boucles for équivalentes.

> ✏️ **Exercice** : Avec une list comprehension, créez : (1) la liste des nombres impairs entre 1 et 50, (2) une liste de cubes des nombres de 1 à 10, (3) les mots de plus de 4 lettres dans une phrase.
`),

        lesson("Copier une liste", `
## Copier une liste correctement

Il existe une subtilité importante lors de la copie de listes.

### Le problème de la référence

\`\`\`python
original = [1, 2, 3, 4, 5]

# ❌ PAS une copie : les deux variables pointent sur la même liste !
copie_fausse = original
copie_fausse.append(99)

print("Original :", original)    # Modifié !
print("Copie :", copie_fausse)
\`\`\`

\`\`\`output
Original : [1, 2, 3, 4, 5, 99]
Copie : [1, 2, 3, 4, 5, 99]
\`\`\`

### Les vraies copies

\`\`\`python
original = [1, 2, 3, 4, 5]

# Méthode 1 : .copy()
copie1 = original.copy()

# Méthode 2 : slicing
copie2 = original[:]

# Méthode 3 : list()
copie3 = list(original)

# Modifier la copie n'affecte pas l'original
copie1.append(99)
copie2.insert(0, 0)

print("Original :", original)
print("Copie 1 :", copie1)
print("Copie 2 :", copie2)
\`\`\`

\`\`\`output
Original : [1, 2, 3, 4, 5]
Copie 1 : [1, 2, 3, 4, 5, 99]
Copie 2 : [0, 1, 2, 3, 4, 5]
\`\`\`

### Copie profonde (deep copy)

\`\`\`python
import copy

# Pour les listes imbriquées, il faut deepcopy
matrice = [[1, 2], [3, 4]]

# Copie superficielle : les sous-listes sont partagées
superficielle = matrice.copy()
superficielle[0].append(99)
print("Matrice originale :", matrice)   # Modifiée !

# Copie profonde : tout est indépendant
matrice2 = [[1, 2], [3, 4]]
profonde = copy.deepcopy(matrice2)
profonde[0].append(99)
print("Matrice2 originale :", matrice2) # Pas modifiée
\`\`\`

\`\`\`output
Matrice originale : [[1, 2, 99], [3, 4]]
Matrice2 originale : [[1, 2], [3, 4]]
\`\`\`

> ⚠️ C'est l'un des pièges les plus courants en Python ! Souvenez-vous : \`b = a\` pour une liste ne crée **pas** une copie.

> ✏️ **Exercice** : Prouvez la différence entre copie par référence et copie réelle avec votre propre exemple.
`, [
          {
            question: "Comment créer une vraie copie indépendante d'une liste ?",
            options: [
              { text: "copie = original", correct: false },
              { text: "copie = original.copy()", correct: true },
              { text: "copie = copy(original)", correct: false },
              { text: "copie = original.clone()", correct: false },
            ]
          },
          {
            question: "Que fait list.pop() sans argument ?",
            options: [
              { text: "Supprime le premier élément", correct: false },
              { text: "Supprime et retourne le dernier élément", correct: true },
              { text: "Vide la liste", correct: false },
              { text: "Retourne la longueur", correct: false },
            ]
          },
          {
            question: "Quelle est la syntaxe d'une list comprehension ?",
            options: [
              { text: "{expr for x in iterable}", correct: false },
              { text: "(expr for x in iterable)", correct: false },
              { text: "[expr for x in iterable]", correct: true },
              { text: "<expr for x in iterable>", correct: false },
            ]
          }
        ]),
      ]
    },

    /* ══════════════════════════════════════════
       MODULE 9 : Tuples et Sets
    ══════════════════════════════════════════ */
    {
      title: "Module 9 — Tuples et Ensembles",
      lessons: [
        lesson("Les tuples", `
## Les tuples

Un **tuple** est une collection ordonnée et **immutable** (non modifiable).

### Créer un tuple

\`\`\`python
# Avec parenthèses
coordonnees = (48.8566, 2.3522)  # Paris lat/lon
couleurs_rgb = (255, 128, 0)

# Sans parenthèses (virgule suffit)
dimensions = 1920, 1080

# Tuple d'un seul élément (noter la virgule !)
singleton = (42,)

print(coordonnees)
print(type(coordonnees))
print(len(couleurs_rgb))
\`\`\`

\`\`\`output
(48.8566, 2.3522)
<class 'tuple'>
3
\`\`\`

### Accès aux éléments (comme les listes)

\`\`\`python
mois = ("jan", "fév", "mar", "avr", "mai", "jun")

print(mois[0])     # jan
print(mois[-1])    # jun
print(mois[1:4])   # ('fév', 'mar', 'avr')

# Décomposition (unpacking)
lat, lon = (48.8566, 2.3522)
print(f"Latitude: {lat}, Longitude: {lon}")

# Swap de variables via tuple
a, b = 10, 20
a, b = b, a
print(f"a={a}, b={b}")
\`\`\`

\`\`\`output
jan
jun
('fév', 'mar', 'avr')
Latitude: 48.8566, Longitude: 2.3522
a=20, b=10
\`\`\`

### Tuple vs Liste — Quand utiliser quoi ?

\`\`\`python
# TUPLE : données fixes qui ne doivent pas changer
point_gps = (48.8566, 2.3522)       # Coordonnées de Paris
date_naissance = (1995, 6, 15)       # Immuable
couleurs_base = ("rouge", "vert", "bleu")

# LISTE : données qui évoluent
panier = ["pomme", "lait"]           # On peut modifier
notes_eleve = [14, 16, 11]          # On peut ajouter des notes
\`\`\`

### Avantage des tuples : clés de dictionnaire

\`\`\`python
# Les tuples peuvent être des clés de dictionnaire (pas les listes)
villes = {
    (48.8566, 2.3522): "Paris",
    (51.5074, -0.1278): "Londres",
    (40.7128, -74.0060): "New York"
}
print(villes[(48.8566, 2.3522)])
\`\`\`

\`\`\`output
Paris
\`\`\`

> 💡 Les tuples sont plus rapides que les listes pour les données fixes. Ils signalent clairement à quiconque lit le code que ces données ne doivent pas être modifiées.

> ✏️ **Exercice** : Créez un tuple de 5 pays avec leurs capitales. Parcourez-les et affichez "La capitale de X est Y" en décomposant chaque tuple.
`),

        lesson("Les ensembles (sets)", `
## Les ensembles — type \`set\`

Un **set** est une collection **non ordonnée** et **sans doublons**.

### Créer un set

\`\`\`python
# Avec des accolades
fruits = {"pomme", "banane", "cerise", "pomme", "banane"}
print(fruits)  # Les doublons sont automatiquement supprimés

# Convertir une liste en set pour supprimer les doublons
notes = [14, 16, 14, 11, 18, 16, 11, 14]
notes_uniques = set(notes)
print(notes_uniques)

# Set vide (attention : {} crée un dict vide, pas un set !)
ensemble_vide = set()
print(type(ensemble_vide))
\`\`\`

\`\`\`output
{'cerise', 'pomme', 'banane'}
{16, 11, 14, 18}
<class 'set'>
\`\`\`

### Opérations ensemblistes

\`\`\`python
python_devs = {"Alice", "Bob", "Charlie", "Diana"}
java_devs = {"Bob", "Eve", "Charlie", "Frank"}

# Union : tous les éléments
tous = python_devs | java_devs
print("Tous :", tous)

# Intersection : éléments communs
les_deux = python_devs & java_devs
print("Les deux langages :", les_deux)

# Différence : dans python mais pas java
python_only = python_devs - java_devs
print("Python uniquement :", python_only)

# Différence symétrique : dans l'un ou l'autre, pas les deux
un_seul = python_devs ^ java_devs
print("Un seul langage :", un_seul)
\`\`\`

\`\`\`output
Tous : {'Diana', 'Frank', 'Eve', 'Alice', 'Charlie', 'Bob'}
Les deux langages : {'Charlie', 'Bob'}
Python uniquement : {'Diana', 'Alice'}
Un seul langage : {'Diana', 'Frank', 'Eve', 'Alice'}
\`\`\`

### Modifier un set

\`\`\`python
technologies = {"Python", "JavaScript"}
technologies.add("Rust")
technologies.add("Python")   # Ignoré (déjà présent)
technologies.discard("Java") # Supprime si présent (pas d'erreur si absent)
print(technologies)

print("Python" in technologies)  # True
print(len(technologies))
\`\`\`

\`\`\`output
{'Rust', 'Python', 'JavaScript'}
True
3
\`\`\`

> 💡 Le cas d'usage principal des sets : **vérifier rapidement si un élément existe** (beaucoup plus rapide que les listes pour les grandes collections) et **éliminer les doublons**.

> ✏️ **Exercice** : Vous avez deux listes d'étudiants inscrits à deux cours. Trouvez ceux inscrits aux deux cours, ceux inscrits uniquement au premier, et le total d'étudiants uniques.
`),

        lesson("Quand utiliser list, tuple ou set ?", `
## Choisir la bonne structure

### Guide de décision

| Critère | list | tuple | set |
|---|---|---|---|
| Ordonné | ✅ Oui | ✅ Oui | ❌ Non |
| Modifiable | ✅ Oui | ❌ Non | ✅ Oui |
| Doublons | ✅ Autorisés | ✅ Autorisés | ❌ Interdits |
| Indexable | ✅ Oui | ✅ Oui | ❌ Non |
| Vitesse recherche | 🐢 Lente | 🐢 Lente | 🚀 Rapide |

### Exemples pratiques

\`\`\`python
# LISTE : ordre important, peut changer
playlist = ["chanson1", "chanson2", "chanson3"]
playlist.append("chanson4")

# TUPLE : données fixes, coordonnées, couleurs
point_a = (0, 0)
point_b = (5, 3)
rouge = (255, 0, 0)

# SET : vérifier appartenance, éléments uniques
mots_interdits = {"spam", "pub", "gratuit"}
message = "Gagnez de l'argent gratuit !"
mots = set(message.lower().split())

contient_spam = bool(mots & mots_interdits)
print(f"Message suspect : {contient_spam}")
print(f"Mots problématiques : {mots & mots_interdits}")
\`\`\`

\`\`\`output
Message suspect : True
Mots problématiques : {'gratuit'}
\`\`\`

### Performance : list vs set pour la recherche

\`\`\`python
import time

# Grande liste vs grand set
grande_liste = list(range(1_000_000))
grand_set = set(range(1_000_000))

# La recherche dans un set est quasi-instantanée
valeur = 999_999
print(valeur in grand_set)    # Très rapide : O(1)
print(valeur in grande_liste) # Plus lent : O(n)
\`\`\`

> 💡 Si vous devez souvent vérifier si des éléments appartiennent à une collection, utilisez un **set** plutôt qu'une **liste** — c'est des dizaines à des milliers de fois plus rapide.

> ✏️ **Exercice** : Créez un programme d'analyse de texte qui compte les mots uniques dans un texte donné, trouve les mots qui apparaissent dans deux textes différents, et affiche les statistiques.
`, [
          {
            question: "Quelle structure ne permet pas les doublons ?",
            options: [
              { text: "list", correct: false },
              { text: "tuple", correct: false },
              { text: "set", correct: true },
              { text: "str", correct: false },
            ]
          },
          {
            question: "Comment créer un tuple à un seul élément ?",
            options: [
              { text: "(42)", correct: false },
              { text: "(42,)", correct: true },
              { text: "[42]", correct: false },
              { text: "{42}", correct: false },
            ]
          },
          {
            question: "Quel opérateur donne l'intersection de deux sets ?",
            options: [
              { text: "|", correct: false },
              { text: "-", correct: false },
              { text: "&", correct: true },
              { text: "^", correct: false },
            ]
          }
        ]),
      ]
    },

    /* ══════════════════════════════════════════
       MODULE 10 : Dictionnaires
    ══════════════════════════════════════════ */
    {
      title: "Module 10 — Dictionnaires",
      lessons: [
        lesson("Créer et accéder aux dictionnaires", `
## Les dictionnaires

Un **dictionnaire** stocke des paires **clé: valeur**. Chaque clé est unique.

### Créer un dictionnaire

\`\`\`python
# Syntaxe avec accolades
personne = {
    "prenom": "Alice",
    "age": 28,
    "ville": "Paris",
    "actif": True
}

# Accéder à une valeur par sa clé
print(personne["prenom"])
print(personne["age"])

# Méthode .get() — sans erreur si clé absente
print(personne.get("email", "Non renseigné"))
\`\`\`

\`\`\`output
Alice
28
Non renseigné
\`\`\`

### Dictionnaire imbriqué

\`\`\`python
etudiants = {
    "alice": {"age": 22, "notes": [14, 16, 18]},
    "bob": {"age": 21, "notes": [11, 13, 12]},
    "charlie": {"age": 23, "notes": [17, 19, 16]},
}

# Accéder à des données imbriquées
print(etudiants["alice"]["notes"])
print(etudiants["bob"]["age"])

# Calculer la moyenne de Charlie
notes_charlie = etudiants["charlie"]["notes"]
moyenne = sum(notes_charlie) / len(notes_charlie)
print(f"Moyenne de Charlie : {moyenne:.1f}")
\`\`\`

\`\`\`output
[14, 16, 18]
21
Moyenne de Charlie : 17.3
\`\`\`

### Créer avec dict()

\`\`\`python
# Depuis des arguments nommés
config = dict(host="localhost", port=5432, debug=True)
print(config)

# Depuis une liste de tuples
paires = [("a", 1), ("b", 2), ("c", 3)]
alphabet = dict(paires)
print(alphabet)
\`\`\`

\`\`\`output
{'host': 'localhost', 'port': 5432, 'debug': True}
{'a': 1, 'b': 2, 'c': 3}
\`\`\`

> 💡 Utilisez \`.get(cle, valeur_defaut)\` au lieu de \`dict[cle]\` quand la clé pourrait ne pas exister. Ça évite un \`KeyError\`.

> ✏️ **Exercice** : Créez un dictionnaire représentant un livre (titre, auteur, année, pages, note). Affichez chaque information avec une étiquette.
`),

        lesson("Modifier un dictionnaire", `
## Modifier un dictionnaire

### Ajouter et modifier

\`\`\`python
profil = {"prenom": "Alice", "age": 25}

# Modifier une valeur existante
profil["age"] = 26
print(profil)

# Ajouter une nouvelle clé
profil["email"] = "alice@exemple.com"
profil["ville"] = "Lyon"
print(profil)
\`\`\`

\`\`\`output
{'prenom': 'Alice', 'age': 26}
{'prenom': 'Alice', 'age': 26, 'email': 'alice@exemple.com', 'ville': 'Lyon'}
\`\`\`

### Supprimer des entrées

\`\`\`python
config = {"host": "localhost", "port": 5432, "debug": True, "log_level": "INFO"}

# del
del config["debug"]

# pop() → retourne la valeur supprimée
port = config.pop("port")
print(f"Port retiré : {port}")
print(config)

# popitem() → retire le dernier ajouté (Python 3.7+)
derniere_cle, derniere_val = config.popitem()
print(f"Retiré : {derniere_cle}={derniere_val}")
print(config)
\`\`\`

\`\`\`output
Port retiré : 5432
{'host': 'localhost', 'log_level': 'INFO'}
Retiré : log_level=INFO
{'host': 'localhost'}
\`\`\`

### Fusionner des dictionnaires

\`\`\`python
info_base = {"nom": "Alice", "age": 25}
info_contact = {"email": "alice@ex.com", "tel": "0601020304"}

# update() : fusionner (modifie en place)
info_base.update(info_contact)
print(info_base)

# Opérateur | (Python 3.9+) : crée un nouveau dict
d1 = {"a": 1, "b": 2}
d2 = {"b": 99, "c": 3}  # "b" de d2 écrase celui de d1
fusionne = d1 | d2
print(fusionne)
\`\`\`

\`\`\`output
{'nom': 'Alice', 'age': 25, 'email': 'alice@ex.com', 'tel': '0601020304'}
{'a': 1, 'b': 99, 'c': 3}
\`\`\`

> ✏️ **Exercice** : Simulez un système d'inventaire de boutique. Ajoutez des articles, modifiez les prix, supprimez des articles épuisés, et affichez l'inventaire final.
`),

        lesson("Itérer sur un dictionnaire", `
## Itérer sur un dictionnaire

### Les trois méthodes d'itération

\`\`\`python
capitales = {
    "France": "Paris",
    "Allemagne": "Berlin",
    "Italie": "Rome",
    "Espagne": "Madrid"
}

# 1. Itérer sur les CLÉS (comportement par défaut)
print("Clés :")
for pays in capitales:
    print(f"  {pays}")

# 2. Itérer sur les VALEURS
print("\\nCapitales :")
for capitale in capitales.values():
    print(f"  {capitale}")

# 3. Itérer sur les PAIRES clé-valeur
print("\\nPays et capitales :")
for pays, capitale in capitales.items():
    print(f"  {pays} → {capitale}")
\`\`\`

\`\`\`output
Clés :
  France
  Allemagne
  Italie
  Espagne

Capitales :
  Paris
  Berlin
  Rome
  Madrid

Pays et capitales :
  France → Paris
  Allemagne → Berlin
  Italie → Rome
  Espagne → Madrid
\`\`\`

### Compter des occurrences

\`\`\`python
texte = "python est un langage python populaire python"
mots = texte.split()

compteur = {}
for mot in mots:
    if mot in compteur:
        compteur[mot] += 1
    else:
        compteur[mot] = 1

print(compteur)

# Ou avec .get() plus élégamment
compteur2 = {}
for mot in mots:
    compteur2[mot] = compteur2.get(mot, 0) + 1

print(compteur2)
\`\`\`

\`\`\`output
{'python': 3, 'est': 1, 'un': 1, 'langage': 1, 'populaire': 1}
{'python': 3, 'est': 1, 'un': 1, 'langage': 1, 'populaire': 1}
\`\`\`

> 💡 La méthode \`.items()\` est la plus utilisée. Elle décompose naturellement chaque paire clé-valeur.

> ✏️ **Exercice** : Analysez un texte et créez un dictionnaire qui compte la fréquence de chaque lettre (ignorez les espaces et la ponctuation).
`),

        lesson("Dict comprehensions", `
## Dict Comprehensions

Comme les list comprehensions, mais pour créer des dictionnaires.

### Syntaxe

\`\`\`python
{cle: valeur for element in iterable if condition}
\`\`\`

### Exemples

\`\`\`python
# Carrés de 1 à 5
carres = {n: n**2 for n in range(1, 6)}
print(carres)

# Inverser un dictionnaire (clés ↔ valeurs)
original = {"France": "Paris", "Allemagne": "Berlin", "Italie": "Rome"}
inverse = {capitale: pays for pays, capitale in original.items()}
print(inverse)

# Filtrer : seulement les adultes
ages = {"Alice": 25, "Bob": 15, "Charlie": 30, "Diana": 17}
adultes = {nom: age for nom, age in ages.items() if age >= 18}
print(adultes)
\`\`\`

\`\`\`output
{1: 1, 2: 4, 3: 9, 4: 16, 5: 25}
{'Paris': 'France', 'Berlin': 'Allemagne', 'Rome': 'Italie'}
{'Alice': 25, 'Charlie': 30}
\`\`\`

### Application pratique

\`\`\`python
# Créer une table des codes ASCII
lettres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
codes_ascii = {lettre: ord(lettre) for lettre in lettres[:5]}
print(codes_ascii)

# Normaliser des notes
notes_brutes = {"Alice": 34, "Bob": 28, "Charlie": 40}
total_max = 40
notes_sur_20 = {nom: round(note * 20 / total_max, 1)
                for nom, note in notes_brutes.items()}
print(notes_sur_20)
\`\`\`

\`\`\`output
{'A': 65, 'B': 66, 'C': 67, 'D': 68, 'E': 69}
{'Alice': 17.0, 'Bob': 14.0, 'Charlie': 20.0}
\`\`\`

> ✏️ **Exercice** : À partir d'une liste de mots, créez un dictionnaire où chaque clé est un mot et chaque valeur est sa longueur. Filtrez pour ne garder que les mots de plus de 4 lettres.
`),

        lesson("Projet : Annuaire téléphonique", `
## Projet — Annuaire Téléphonique

Un annuaire complet avec toutes les opérations CRUD !

\`\`\`python
annuaire = {}

def afficher_annuaire():
    if not annuaire:
        print("  L'annuaire est vide.")
        return
    print(f"  {'Nom':<20} {'Téléphone':<15}")
    print("  " + "─" * 35)
    for nom in sorted(annuaire.keys()):
        print(f"  {nom:<20} {annuaire[nom]:<15}")

def ajouter_contact(nom, telephone):
    if nom in annuaire:
        print(f"  ⚠️ {nom} existe déjà (tel: {annuaire[nom]})")
    else:
        annuaire[nom] = telephone
        print(f"  ✅ {nom} ajouté avec succès.")

def rechercher_contact(nom):
    if nom in annuaire:
        print(f"  📞 {nom} : {annuaire[nom]}")
    else:
        print(f"  ❌ '{nom}' introuvable dans l'annuaire.")

def supprimer_contact(nom):
    if nom in annuaire:
        tel = annuaire.pop(nom)
        print(f"  🗑️ {nom} ({tel}) supprimé.")
    else:
        print(f"  ❌ '{nom}' introuvable.")

# Démonstration
ajouter_contact("Alice Martin", "06 12 34 56 78")
ajouter_contact("Bob Dupont", "07 98 76 54 32")
ajouter_contact("Charlie Durand", "06 55 44 33 22")

print("\\n📒 ANNUAIRE COMPLET")
afficher_annuaire()

rechercher_contact("Bob Dupont")
supprimer_contact("Charlie Durand")

print("\\n📒 APRÈS SUPPRESSION")
afficher_annuaire()
\`\`\`

\`\`\`output
  ✅ Alice Martin ajouté avec succès.
  ✅ Bob Dupont ajouté avec succès.
  ✅ Charlie Durand ajouté avec succès.

📒 ANNUAIRE COMPLET
  Nom                  Téléphone      
  ───────────────────────────────────
  Alice Martin         06 12 34 56 78 
  Bob Dupont           07 98 76 54 32 
  Charlie Durand       06 55 44 33 22 

  📞 Bob Dupont : 07 98 76 54 32
  🗑️ Charlie Durand (06 55 44 33 22) supprimé.

📒 APRÈS SUPPRESSION
  Nom                  Téléphone      
  ───────────────────────────────────
  Alice Martin         06 12 34 56 78 
  Bob Dupont           07 98 76 54 32 
\`\`\`

> ✏️ **Amélioration** : Ajoutez la sauvegarde dans un fichier JSON, la possibilité de modifier un numéro existant, et une recherche partielle (chercher "ali" retrouve "Alice Martin").
`, [
          {
            question: "Comment accéder à une clé sans risque de KeyError ?",
            options: [
              { text: "dict[cle]", correct: false },
              { text: "dict.get(cle, valeur_defaut)", correct: true },
              { text: "dict.find(cle)", correct: false },
              { text: "dict.safe_get(cle)", correct: false },
            ]
          },
          {
            question: "Quelle méthode retourne des paires (clé, valeur) ?",
            options: [
              { text: ".keys()", correct: false },
              { text: ".values()", correct: false },
              { text: ".items()", correct: true },
              { text: ".pairs()", correct: false },
            ]
          },
          {
            question: "Comment fusionner deux dictionnaires en Python 3.9+ ?",
            options: [
              { text: "d1 + d2", correct: false },
              { text: "d1.merge(d2)", correct: false },
              { text: "d1 | d2", correct: true },
              { text: "dict.concat(d1, d2)", correct: false },
            ]
          }
        ]),
      ]
    },

    /* ══════════════════════════════════════════
       MODULE 11 : Chaînes avancées
    ══════════════════════════════════════════ */
    {
      title: "Module 11 — Chaînes de Caractères Avancées",
      lessons: [
        lesson("Méthodes essentielles des chaînes", `
## Méthodes des chaînes

Les chaînes ont des dizaines de méthodes intégrées.

### Casse et nettoyage

\`\`\`python
texte = "  Bonjour Le Monde !  "

print(texte.upper())         # Tout en majuscules
print(texte.lower())         # Tout en minuscules
print(texte.title())         # Première lettre de chaque mot
print(texte.strip())         # Supprimer espaces avant/après
print(texte.lstrip())        # Supprimer à gauche seulement
print(texte.rstrip())        # Supprimer à droite seulement
print(texte.strip().capitalize())  # Première lettre uniquement
\`\`\`

\`\`\`output
  BONJOUR LE MONDE !  
  bonjour le monde !  
  Bonjour Le Monde !  
Bonjour Le Monde !
Bonjour Le Monde !  
  Bonjour Le Monde !
Bonjour le monde !
\`\`\`

### Recherche et remplacement

\`\`\`python
phrase = "Python est génial. Python est puissant."

print(phrase.find("Python"))          # Premier index
print(phrase.count("Python"))         # Nombre d'occurrences
print(phrase.replace("Python", "Go")) # Remplacer tout
print(phrase.startswith("Python"))    # Commence par ?
print(phrase.endswith("."))           # Finit par ?
print("génial" in phrase)             # Contient ?
\`\`\`

\`\`\`output
0
2
Go est génial. Go est puissant.
True
True
True
\`\`\`

### Découper et assembler

\`\`\`python
# split() : séparer en liste
csv_ligne = "Alice,25,Paris,Développeuse"
donnees = csv_ligne.split(",")
print(donnees)

# join() : assembler une liste en chaîne
mots = ["Python", "est", "génial"]
phrase = " ".join(mots)
print(phrase)

# Séparer les lignes
texte_multiligne = "ligne1\\nligne2\\nligne3"
lignes = texte_multiligne.splitlines()
print(lignes)
\`\`\`

\`\`\`output
['Alice', '25', 'Paris', 'Développeuse']
Python est génial
['ligne1', 'ligne2', 'ligne3']
\`\`\`

> 💡 \`.join()\` est la méthode recommandée pour assembler des chaînes. Elle est bien plus rapide que de concaténer avec \`+\` dans une boucle.

> ✏️ **Exercice** : Créez une fonction qui nettoie une adresse email : supprime les espaces, met en minuscules, et vérifie qu'elle contient "@" et ".".
`),

        lesson("Slicing des chaînes", `
## Découpage des chaînes

Le slicing (découpage) fonctionne de la même façon que pour les listes.

### Syntaxe

\`\`\`python
chaine[debut:fin:pas]
\`\`\`

### Exemples de base

\`\`\`python
texte = "Hello, Python !"

print(texte[0:5])      # "Hello"
print(texte[7:])       # "Python !"
print(texte[:5])       # "Hello"
print(texte[-1])       # "!"
print(texte[-7:-1])    # "Python"
print(texte[::2])      # Un caractère sur deux
print(texte[::-1])     # Inversé
\`\`\`

\`\`\`output
Hello
Python !
Hello
!
Python
Hlo yhn!
!nohtyP ,olleH
\`\`\`

### Applications pratiques

\`\`\`python
# Vérifier si un mot est un palindrome
def est_palindrome(mot):
    mot = mot.lower().replace(" ", "")
    return mot == mot[::-1]

mots = ["kayak", "python", "radar", "python", "level"]
for mot in mots:
    print(f"{mot:10} → {'palindrome ✅' if est_palindrome(mot) else 'non ❌'}")
\`\`\`

\`\`\`output
kayak      → palindrome ✅
python     → non ❌
radar      → palindrome ✅
python     → non ❌
level      → palindrome ✅
\`\`\`

### Extraire des parties de chaînes

\`\`\`python
# Extraire l'extension d'un fichier
fichier = "rapport_final_v2.pdf"
extension = fichier.split(".")[-1]
nom_sans_ext = fichier[:-(len(extension)+1)]
print(f"Fichier : {nom_sans_ext}")
print(f"Extension : .{extension}")

# Masquer un numéro de carte
carte = "4532 1234 5678 9012"
masquee = "**** **** **** " + carte[-4:]
print(f"Carte : {masquee}")
\`\`\`

\`\`\`output
Fichier : rapport_final_v2
Extension : .pdf
Carte : **** **** **** 9012
\`\`\`

> ✏️ **Exercice** : Créez une fonction \`initiales(nom_complet)\` qui retourne les initiales d'un nom complet. Ex: "Jean-Paul Martin" → "J.P.M."
`),

        lesson("Formatage avancé des chaînes", `
## Formatage avancé

### f-strings — Rappel et fonctionnalités avancées

\`\`\`python
# Aligner du texte
nom = "Alice"
print(f"|{nom:<15}|")   # Gauche
print(f"|{nom:^15}|")   # Centre
print(f"|{nom:>15}|")   # Droite

# Remplir avec un caractère
print(f"|{nom:*<15}|")  # Remplir gauche avec *
print(f"|{nom:─^15}|")  # Centré avec ─
print(f"|{nom:->15}|")  # Remplir droite avec -
\`\`\`

\`\`\`output
|Alice          |
|     Alice     |
|          Alice|
|Alice**********|
|─────Alice─────|
|----------Alice|
\`\`\`

### Créer des tableaux formatés

\`\`\`python
donnees = [
    ("Produit", "Qté", "Prix unit.", "Total"),
    ("Clavier", 2, 49.99, 99.98),
    ("Souris", 3, 25.00, 75.00),
    ("Écran", 1, 299.99, 299.99),
]

print(f"{'Produit':<15} {'Qté':>5} {'Prix':>12} {'Total':>10}")
print("─" * 45)
for ligne in donnees[1:]:
    produit, qty, prix, total = ligne
    print(f"{produit:<15} {qty:>5} {prix:>12.2f} {total:>10.2f}")
print("─" * 45)
total_general = sum(d[3] for d in donnees[1:])
print(f"{'TOTAL':<33} {total_general:>10.2f}")
\`\`\`

\`\`\`output
Produit           Qté    Prix unit.      Total
─────────────────────────────────────────────
Clavier             2        49.99       99.98
Souris              3        25.00       75.00
Écran               1       299.99      299.99
─────────────────────────────────────────────
TOTAL                                   474.97
\`\`\`

> 💡 La puissance des f-strings réside dans leur capacité à combiner du texte et des calculs dans une syntaxe très lisible.

> ✏️ **Exercice** : Créez un bulletin scolaire formaté avec le nom de l'élève, une liste de matières avec notes, la moyenne, et la mention correspondante — le tout bien aligné.
`, [
          {
            question: "Quelle méthode sépare une chaîne en liste selon un séparateur ?",
            options: [
              { text: ".break()", correct: false },
              { text: ".split()", correct: true },
              { text: ".separate()", correct: false },
              { text: ".divide()", correct: false },
            ]
          },
          {
            question: "Comment inverser une chaîne 'abc' avec le slicing ?",
            options: [
              { text: "abc[0:-1]", correct: false },
              { text: "abc.reverse()", correct: false },
              { text: "abc[::-1]", correct: true },
              { text: "abc[-1:0]", correct: false },
            ]
          }
        ]),
      ]
    },

    /* ══════════════════════════════════════════
       MODULE 12 : Fichiers
    ══════════════════════════════════════════ */
    {
      title: "Module 12 — Gestion des Fichiers",
      lessons: [
        lesson("Lire et écrire dans un fichier texte", `
## Travailler avec les fichiers

Python permet de lire et écrire des fichiers facilement.

### Écrire dans un fichier

\`\`\`python
# Écrire (crée le fichier s'il n'existe pas, écrase s'il existe)
with open("notes.txt", "w", encoding="utf-8") as fichier:
    fichier.write("Alice : 16\\n")
    fichier.write("Bob : 14\\n")
    fichier.write("Charlie : 18\\n")

print("Fichier créé avec succès !")
\`\`\`

\`\`\`output
Fichier créé avec succès !
\`\`\`

### Lire un fichier

\`\`\`python
# Lire tout le contenu
with open("notes.txt", "r", encoding="utf-8") as fichier:
    contenu = fichier.read()
    print(contenu)
\`\`\`

\`\`\`output
Alice : 16
Bob : 14
Charlie : 18
\`\`\`

### Lire ligne par ligne

\`\`\`python
with open("notes.txt", "r", encoding="utf-8") as fichier:
    for i, ligne in enumerate(fichier, 1):
        ligne = ligne.strip()  # Supprimer le \\n final
        print(f"Ligne {i}: {ligne}")
\`\`\`

\`\`\`output
Ligne 1: Alice : 16
Ligne 2: Bob : 14
Ligne 3: Charlie : 18
\`\`\`

### Modes d'ouverture

| Mode | Description |
|---|---|
| \`"r"\` | Lecture (défaut) |
| \`"w"\` | Écriture (écrase) |
| \`"a"\` | Ajout (append) |
| \`"r+"\` | Lecture + Écriture |
| \`"rb"\` | Lecture binaire |

\`\`\`python
# Mode "a" : ajouter sans effacer
with open("notes.txt", "a", encoding="utf-8") as fichier:
    fichier.write("Diana : 19\\n")

# Vérifier
with open("notes.txt", "r", encoding="utf-8") as f:
    print(f.read())
\`\`\`

\`\`\`output
Alice : 16
Bob : 14
Charlie : 18
Diana : 19
\`\`\`

> 💡 Utilisez toujours le **context manager** \`with open() as f:\`. Il ferme automatiquement le fichier même si une erreur survient.

> ✏️ **Exercice** : Créez un programme de journal de bord. L'utilisateur entre une note, qui est sauvegardée dans un fichier avec la date du jour. À chaque lancement, les entrées précédentes sont affichées.
`),

        lesson("Travailler avec JSON", `
## Fichiers JSON

**JSON** (JavaScript Object Notation) est le format standard pour échanger des données structurées.

### Structure JSON

\`\`\`json
{
    "prenom": "Alice",
    "age": 28,
    "langages": ["Python", "JavaScript"],
    "adresse": {
        "ville": "Paris",
        "code_postal": "75001"
    }
}
\`\`\`

### Écrire du JSON

\`\`\`python
import json

donnees = {
    "formation": "Python",
    "niveau": "Débutant",
    "modules": ["Variables", "Boucles", "Fonctions"],
    "duree_heures": 40,
    "en_ligne": True,
    "prix": 29.99
}

# Sauvegarder en JSON
with open("formation.json", "w", encoding="utf-8") as f:
    json.dump(donnees, f, indent=4, ensure_ascii=False)

print("Fichier JSON créé !")
\`\`\`

### Lire du JSON

\`\`\`python
import json

with open("formation.json", "r", encoding="utf-8") as f:
    formation = json.load(f)

print(f"Formation : {formation['formation']}")
print(f"Niveau : {formation['niveau']}")
print(f"Prix : {formation['prix']} €")
print("Modules :")
for module in formation["modules"]:
    print(f"  • {module}")
\`\`\`

\`\`\`output
Formation : Python
Niveau : Débutant
Prix : 29.99 €
Modules :
  • Variables
  • Boucles
  • Fonctions
\`\`\`

### JSON en mémoire (sans fichier)

\`\`\`python
import json

# Python → JSON string
donnees = {"nom": "Alice", "score": 1250}
json_str = json.dumps(donnees)
print(json_str)

# JSON string → Python
retour = json.loads(json_str)
print(retour["nom"])
\`\`\`

\`\`\`output
{"nom": "Alice", "score": 1250}
Alice
\`\`\`

> 💡 JSON est parfait pour sauvegarder la configuration d'une application, les données d'utilisateurs, ou communiquer avec des APIs web.

> ✏️ **Exercice** : Créez un système de contacts sauvegardé en JSON. Fonctions : ajouter, supprimer, rechercher, lister. Les données sont persistantes entre les lancements.
`, [
          {
            question: "Quel est le bon mot-clé pour ouvrir un fichier en Python ?",
            options: [
              { text: "open_file()", correct: false },
              { text: "with open() as f:", correct: true },
              { text: "File.open()", correct: false },
              { text: "read_file()", correct: false },
            ]
          },
          {
            question: "Quel mode d'ouverture ajoute du contenu sans effacer ?",
            options: [
              { text: "\"w\"", correct: false },
              { text: "\"r\"", correct: false },
              { text: "\"a\"", correct: true },
              { text: "\"x\"", correct: false },
            ]
          }
        ]),
      ]
    },

    /* ══════════════════════════════════════════
       MODULE 13 : Exceptions
    ══════════════════════════════════════════ */
    {
      title: "Module 13 — Gestion des Erreurs et Exceptions",
      lessons: [
        lesson("Les types d'erreurs Python", `
## Les erreurs et exceptions

Python a deux types de problèmes :
- **Erreurs de syntaxe** : détectées avant l'exécution
- **Exceptions** : surviennent pendant l'exécution

### Les exceptions les plus courantes

\`\`\`python
# ValueError : valeur incorrecte pour le type
try:
    int("abc")
except ValueError as e:
    print(f"ValueError : {e}")

# TypeError : mauvais type
try:
    "5" + 5
except TypeError as e:
    print(f"TypeError : {e}")

# ZeroDivisionError : division par zéro
try:
    10 / 0
except ZeroDivisionError as e:
    print(f"ZeroDivisionError : {e}")

# IndexError : index hors limites
try:
    liste = [1, 2, 3]
    print(liste[10])
except IndexError as e:
    print(f"IndexError : {e}")

# KeyError : clé inexistante dans un dict
try:
    d = {"a": 1}
    print(d["b"])
except KeyError as e:
    print(f"KeyError : {e}")
\`\`\`

\`\`\`output
ValueError : invalid literal for int() with base 10: 'abc'
TypeError : can only concatenate str (not "int") to str
ZeroDivisionError : division by zero
IndexError : list index out of range
KeyError : 'b'
\`\`\`

> 💡 Comprendre les types d'erreurs vous permet d'anticiper et de gérer les problèmes dans vos programmes.

> ✏️ **Exercice** : Provoquez volontairement chaque type d'exception vu ici, puis ajoutez un try/except pour les gérer proprement.
`),

        lesson("try / except / else / finally", `
## La gestion complète des exceptions

### Structure de base

\`\`\`python
try:
    # Code qui peut échouer
    resultat = 10 / int(input("Diviseur : "))
    print(f"Résultat : {resultat:.2f}")
except ValueError:
    print("Erreur : entrez un nombre entier !")
except ZeroDivisionError:
    print("Erreur : division par zéro impossible !")
\`\`\`

### Avec else et finally

\`\`\`python
def lire_fichier_securise(nom):
    try:
        with open(nom, "r") as f:
            contenu = f.read()
    except FileNotFoundError:
        print(f"❌ Fichier '{nom}' introuvable.")
        return None
    except PermissionError:
        print(f"❌ Permission refusée pour '{nom}'.")
        return None
    else:
        # Exécuté SEULEMENT si aucune exception
        print(f"✅ Fichier lu avec succès ({len(contenu)} caractères)")
        return contenu
    finally:
        # TOUJOURS exécuté, succès ou échec
        print("   → Opération terminée.")

lire_fichier_securise("inexistant.txt")
\`\`\`

\`\`\`output
❌ Fichier 'inexistant.txt' introuvable.
   → Opération terminée.
\`\`\`

### Capturer l'exception et afficher le message

\`\`\`python
def calculer_division(a, b):
    try:
        return a / b
    except (TypeError, ZeroDivisionError) as e:
        print(f"Erreur de calcul : {type(e).__name__}: {e}")
        return None
    except Exception as e:
        # Capture tout le reste
        print(f"Erreur inattendue : {e}")
        return None

print(calculer_division(10, 3))
calculer_division(10, 0)
calculer_division("a", 5)
\`\`\`

\`\`\`output
3.3333333333333335
Erreur de calcul : ZeroDivisionError: division by zero
Erreur de calcul : TypeError: unsupported operand type(s) for /: 'str' and 'int'
\`\`\`

> ⚠️ Ne capturez jamais toutes les exceptions avec \`except:\` (sans type). Vous risquez de cacher des bugs réels. Soyez le plus spécifique possible.

> ✏️ **Exercice** : Créez une fonction \`saisie_entier(message, mini, maxi)\` qui demande un entier à l'utilisateur, valide qu'il est dans l'intervalle [mini, maxi], gère les erreurs de saisie, et répète jusqu'à une saisie valide.
`),

        lesson("Créer ses propres exceptions", `
## Exceptions personnalisées

Créer ses propres exceptions rend le code plus expressif.

### Créer une exception simple

\`\`\`python
class AgeInvalideError(Exception):
    """Exception levée quand l'âge est invalide."""
    
    def __init__(self, age, message="Âge invalide"):
        self.age = age
        self.message = message
        super().__init__(f"{message}: {age}")

def valider_age(age):
    if not isinstance(age, int):
        raise AgeInvalideError(age, "L'âge doit être un entier")
    if age < 0:
        raise AgeInvalideError(age, "L'âge ne peut pas être négatif")
    if age > 150:
        raise AgeInvalideError(age, "Âge impossible")
    return age

# Test
for age_test in [25, -5, 200, "vingt"]:
    try:
        age_valide = valider_age(age_test)
        print(f"✅ Âge {age_valide} valide")
    except AgeInvalideError as e:
        print(f"❌ {e}")
\`\`\`

\`\`\`output
✅ Âge 25 valide
❌ Âge ne peut pas être négatif: -5
❌ Âge impossible: 200
❌ L'âge doit être un entier: vingt
\`\`\`

### Hiérarchie d'exceptions

\`\`\`python
class ErreurApplication(Exception):
    """Exception de base pour notre application."""
    pass

class ErreurAuthentification(ErreurApplication):
    pass

class ErreurMotDePasse(ErreurAuthentification):
    pass

class ErreurCompteBloque(ErreurAuthentification):
    pass

def connecter(login, mdp, tentatives):
    if tentatives >= 3:
        raise ErreurCompteBloque("Compte bloqué après 3 tentatives")
    if mdp != "secret":
        raise ErreurMotDePasse(f"Mot de passe incorrect (tentative {tentatives+1})")
    return f"Connecté en tant que {login}"

# Utilisation
try:
    result = connecter("alice", "mauvais", 3)
except ErreurCompteBloque as e:
    print(f"🔒 {e}")
except ErreurMotDePasse as e:
    print(f"🔑 {e}")
except ErreurApplication as e:
    print(f"❌ Erreur : {e}")
\`\`\`

\`\`\`output
🔒 Compte bloqué après 3 tentatives
\`\`\`

> 💡 Les exceptions personnalisées rendent votre code beaucoup plus lisible et permettent une gestion d'erreurs précise et hiérarchique.

> ✏️ **Exercice** : Créez un système de validation d'email avec une exception \`EmailInvalideError\` qui vérifie : présence de "@", domaine valide, longueur minimale.
`, [
          {
            question: "Quelle clause s'exécute toujours, qu'il y ait une erreur ou non ?",
            options: [
              { text: "else", correct: false },
              { text: "except", correct: false },
              { text: "finally", correct: true },
              { text: "always", correct: false },
            ]
          },
          {
            question: "Comment lever une exception manuellement ?",
            options: [
              { text: "throw Exception()", correct: false },
              { text: "raise Exception()", correct: true },
              { text: "error Exception()", correct: false },
              { text: "trigger Exception()", correct: false },
            ]
          }
        ]),
      ]
    },

    /* ══════════════════════════════════════════
       MODULE 14 : Modules et packages
    ══════════════════════════════════════════ */
    {
      title: "Module 14 — Modules et Packages",
      lessons: [
        lesson("Les modules standards", `
## Modules standards Python

Python est livré avec une grande bibliothèque standard.

### Le module math

\`\`\`python
import math

print(f"Pi : {math.pi}")
print(f"e : {math.e:.4f}")
print(f"Racine de 144 : {math.sqrt(144)}")
print(f"Cosinus de 0 : {math.cos(0)}")
print(f"Log10 de 1000 : {math.log10(1000)}")
print(f"Factorielle de 7 : {math.factorial(7)}")
print(f"Arrondi supérieur de 4.2 : {math.ceil(4.2)}")
print(f"Arrondi inférieur de 4.9 : {math.floor(4.9)}")
\`\`\`

\`\`\`output
Pi : 3.141592653589793
e : 2.7183
Racine de 144 : 12.0
Cosinus de 0 : 1.0
Log10 de 1000 : 3.0
Factorielle de 7 : 5040
Arrondi supérieur de 4.2 : 5
Arrondi inférieur de 4.9 : 4
\`\`\`

### Le module random

\`\`\`python
import random

# Nombre aléatoire entre 0.0 et 1.0
print(random.random())

# Entier aléatoire entre a et b (inclus)
print(random.randint(1, 6))  # Dé à 6 faces

# Élément aléatoire d'une liste
fruits = ["pomme", "banane", "cerise"]
print(random.choice(fruits))

# Mélanger une liste
cartes = list(range(1, 14))
random.shuffle(cartes)
print(cartes[:5])

# Plusieurs éléments aléatoires
print(random.sample(range(1, 50), 6))  # Tirage loto
\`\`\`

\`\`\`output
0.37444887175646646
3
banane
[7, 2, 12, 4, 9]
[8, 23, 41, 15, 37, 6]
\`\`\`

### Le module datetime

\`\`\`python
from datetime import datetime, date, timedelta

maintenant = datetime.now()
print(f"Maintenant : {maintenant.strftime('%d/%m/%Y %H:%M:%S')}")

aujourd_hui = date.today()
print(f"Aujourd'hui : {aujourd_hui}")

# Calculer des intervalles de temps
naissance = date(1995, 6, 15)
age_jours = (aujourd_hui - naissance).days
print(f"Âge en jours : {age_jours}")

# Ajouter des jours
dans_30_jours = aujourd_hui + timedelta(days=30)
print(f"Dans 30 jours : {dans_30_jours}")
\`\`\`

> 💡 Python a plus de 200 modules standards. Avant de chercher une bibliothèque externe, vérifiez si Python ne propose pas déjà ce dont vous avez besoin !

> ✏️ **Exercice** : Créez un simulateur de tirage de dé. Lancez 1000 fois un dé à 6 faces et affichez la fréquence de chaque face (devrait être ~16.7% chacune).
`),

        lesson("Créer son propre module", `
## Créer et utiliser ses propres modules

### Structure d'un projet

\`\`\`
mon_projet/
├── main.py
├── calculs.py
├── affichage.py
└── utils.py
\`\`\`

### Exemple : le module calculs.py

\`\`\`python
# fichier: calculs.py
"""Module de fonctions mathématiques."""

def aire_rectangle(longueur, largeur):
    """Calcule l'aire d'un rectangle."""
    return longueur * largeur

def aire_cercle(rayon):
    """Calcule l'aire d'un cercle."""
    import math
    return math.pi * rayon ** 2

def est_premier(n):
    """Vérifie si n est un nombre premier."""
    if n < 2:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True

CONSTANTE_GRAVITE = 9.81  # m/s²
\`\`\`

### Utiliser le module dans main.py

\`\`\`python
# fichier: main.py

# Importer tout le module
import calculs

print(calculs.aire_rectangle(5, 3))
print(f"Gravité : {calculs.CONSTANTE_GRAVITE}")

# Importer des fonctions spécifiques
from calculs import aire_cercle, est_premier

print(f"Aire cercle r=7 : {aire_cercle(7):.2f}")
print(f"17 est premier : {est_premier(17)}")

# Renommer à l'import
from calculs import aire_rectangle as rect
print(rect(10, 4))
\`\`\`

\`\`\`output
15
Gravité : 9.81
Aire cercle r=7 : 153.94
17 est premier : True
40
\`\`\`

### Le bloc if __name__ == "__main__"

\`\`\`python
# Dans calculs.py

def aire_rectangle(l, w): return l * w

# Ce code ne s'exécute QUE si on lance ce fichier directement
# (pas quand on l'importe depuis un autre fichier)
if __name__ == "__main__":
    print("Tests du module calculs")
    print(aire_rectangle(5, 3))   # 15
\`\`\`

> 💡 Le bloc \`if __name__ == "__main__":\` est une convention essentielle. Il permet de tester un module directement tout en évitant que le code de test s'exécute quand le module est importé.

> ✏️ **Exercice** : Créez un module \`geometrie.py\` avec des fonctions pour calculer l'aire et le périmètre de formes géométriques (rectangle, cercle, triangle). Testez-le depuis \`main.py\`.
`),

        lesson("pip et les packages externes", `
## pip — Gestionnaire de paquets Python

### Qu'est-ce que pip ?

**pip** est l'outil officiel pour installer des bibliothèques Python tierces.

### Commandes essentielles

\`\`\`python
# Dans le terminal (pas dans Python !)
# Installer un paquet
pip install requests

# Installer une version spécifique
pip install requests==2.28.0

# Mettre à jour
pip install --upgrade requests

# Désinstaller
pip uninstall requests

# Lister les paquets installés
pip list

# Générer un fichier de dépendances
pip freeze > requirements.txt

# Installer depuis requirements.txt
pip install -r requirements.txt
\`\`\`

### Packages populaires à connaître

| Package | Utilisation |
|---|---|
| \`requests\` | Requêtes HTTP, appels API |
| \`pandas\` | Analyse de données |
| \`numpy\` | Calcul numérique |
| \`matplotlib\` | Graphiques et visualisations |
| \`flask\` | Serveur web léger |
| \`django\` | Framework web complet |
| \`pillow\` | Traitement d'images |
| \`pytest\` | Tests automatisés |

### Exemple avec requests

\`\`\`python
# Après : pip install requests
import requests

# Appeler une API publique
response = requests.get("https://api.github.com")
print(f"Status : {response.status_code}")
print(f"Type de contenu : {response.headers['content-type']}")

data = response.json()
print(f"API GitHub version : {data.get('current_user_url', 'N/A')}")
\`\`\`

### Environnements virtuels

\`\`\`python
# Créer un environnement virtuel (terminal)
python -m venv mon_env

# Activer (Linux/Mac)
source mon_env/bin/activate

# Activer (Windows)
mon_env\\Scripts\\activate

# Désactiver
deactivate
\`\`\`

> 💡 Utilisez toujours un **environnement virtuel** pour vos projets. Cela isole les dépendances de chaque projet et évite les conflits de versions.

> ✏️ **Exercice** : Installez \`requests\`, puis créez un programme qui récupère la blague du jour depuis \`https://official-joke-api.appspot.com/random_joke\` et l'affiche proprement.
`, [
          {
            question: "Quelle commande installe un package Python ?",
            options: [
              { text: "python install requests", correct: false },
              { text: "pip install requests", correct: true },
              { text: "import install requests", correct: false },
              { text: "get-pip requests", correct: false },
            ]
          },
          {
            question: "Que fait 'if __name__ == \"__main__\"' ?",
            options: [
              { text: "Définit le nom du module", correct: false },
              { text: "Exécute le code seulement si le fichier est lancé directement", correct: true },
              { text: "Importe automatiquement des modules", correct: false },
              { text: "Protège le code des modifications", correct: false },
            ]
          }
        ]),
      ]
    },

    /* ══════════════════════════════════════════
       MODULE 15 : POO
    ══════════════════════════════════════════ */
    {
      title: "Module 15 — Programmation Orientée Objet",
      lessons: [
        lesson("Introduction à la POO", `
## La Programmation Orientée Objet

La **POO** est un paradigme de programmation qui organise le code en **objets** combinant données (attributs) et comportements (méthodes).

### Les 4 piliers de la POO

1. **Encapsulation** : regrouper données et méthodes, cacher les détails internes
2. **Abstraction** : exposer seulement ce qui est nécessaire
3. **Héritage** : une classe peut hériter d'une autre
4. **Polymorphisme** : une méthode peut se comporter différemment selon l'objet

### Analogie du monde réel

Imaginez un **voiture** :
- **Attributs** (données) : couleur, marque, vitesse, carburant
- **Méthodes** (actions) : démarrer(), accélérer(), freiner(), refaire_le_plein()

\`\`\`python
# Sans POO : données dispersées
voiture_couleur = "rouge"
voiture_marque = "Toyota"
voiture_vitesse = 0

def accelerer_voiture(vitesse):
    return vitesse + 10

# Avec POO : tout est regroupé dans un objet
class Voiture:
    def __init__(self, couleur, marque):
        self.couleur = couleur
        self.marque = marque
        self.vitesse = 0
    
    def accelerer(self):
        self.vitesse += 10
        return self.vitesse

ma_voiture = Voiture("rouge", "Toyota")
print(ma_voiture.accelerer())  # 10
print(ma_voiture.accelerer())  # 20
\`\`\`

\`\`\`output
10
20
\`\`\`

> 💡 La POO devient essentielle pour les **grands projets**. Elle permet d'organiser le code, de le réutiliser et de le maintenir plus facilement.

> ✏️ **Exercice** : Listez les attributs et méthodes que pourrait avoir une classe \`Smartphone\`, une classe \`Compte bancaire\`, et une classe \`Étudiant\`.
`),

        lesson("Créer une classe et ses attributs", `
## Créer une classe

### Syntaxe de base

\`\`\`python
class NomClasse:
    def __init__(self, param1, param2):
        # Attributs d'instance
        self.attribut1 = param1
        self.attribut2 = param2
\`\`\`

### Exemple complet

\`\`\`python
class Etudiant:
    # Attribut de CLASSE (partagé par tous les objets)
    etablissement = "Université Maodo"
    
    def __init__(self, prenom, nom, age, filiere):
        # Attributs d'INSTANCE (propres à chaque objet)
        self.prenom = prenom
        self.nom = nom
        self.age = age
        self.filiere = filiere
        self.notes = []  # Initialisé vide
    
    def ajouter_note(self, note):
        self.notes.append(note)
    
    def calculer_moyenne(self):
        if not self.notes:
            return 0
        return sum(self.notes) / len(self.notes)
    
    def afficher_profil(self):
        print(f"┌{'─'*35}")
        print(f"│ {self.prenom} {self.nom.upper()}")
        print(f"│ Âge : {self.age} ans")
        print(f"│ Filière : {self.filiere}")
        print(f"│ Établissement : {self.etablissement}")
        if self.notes:
            print(f"│ Moyenne : {self.calculer_moyenne():.2f}/20")
        print(f"└{'─'*35}")

# Créer des instances
alice = Etudiant("Alice", "Martin", 21, "Informatique")
bob = Etudiant("Bob", "Dupont", 22, "Mathématiques")

alice.ajouter_note(14)
alice.ajouter_note(16)
alice.ajouter_note(18)

alice.afficher_profil()
bob.afficher_profil()
\`\`\`

\`\`\`output
┌───────────────────────────────────
│ Alice MARTIN
│ Âge : 21 ans
│ Filière : Informatique
│ Établissement : Université Maodo
│ Moyenne : 16.00/20
└───────────────────────────────────
┌───────────────────────────────────
│ Bob DUPONT
│ Âge : 22 ans
│ Filière : Mathématiques
│ Établissement : Université Maodo
└───────────────────────────────────
\`\`\`

> 💡 \`self\` représente l'instance courante de la classe. C'est une convention Python (ce nom est obligatoire en premier paramètre de chaque méthode d'instance).

> ✏️ **Exercice** : Créez une classe \`Produit\` avec attributs nom, prix, stock. Méthodes : \`appliquer_reduction(pourcent)\`, \`vendre(quantite)\`, \`afficher_info()\`.
`),

        lesson("L'héritage", `
## L'héritage

L'héritage permet à une classe (**sous-classe**) de **hériter** des attributs et méthodes d'une autre (**classe parente**).

### Syntaxe

\`\`\`python
class ClasseEnfant(ClasseParente):
    pass
\`\`\`

### Exemple : hiérarchie d'animaux

\`\`\`python
class Animal:
    def __init__(self, nom, age):
        self.nom = nom
        self.age = age
    
    def se_presenter(self):
        print(f"Je suis {self.nom}, j'ai {self.age} an(s).")
    
    def manger(self):
        print(f"{self.nom} mange.")


class Chien(Animal):
    def __init__(self, nom, age, race):
        super().__init__(nom, age)  # Appel du constructeur parent
        self.race = race
    
    def aboyer(self):
        print(f"{self.nom} : Ouaf Ouaf !")
    
    def se_presenter(self):  # Redéfinition (override)
        super().se_presenter()
        print(f"Je suis un {self.race}.")


class Chat(Animal):
    def __init__(self, nom, age, interieur=True):
        super().__init__(nom, age)
        self.interieur = interieur
    
    def miauler(self):
        print(f"{self.nom} : Miaou !")


# Utilisation
rex = Chien("Rex", 3, "Berger Allemand")
misty = Chat("Misty", 5)

rex.se_presenter()
rex.aboyer()
rex.manger()  # Héritée de Animal

print()
misty.se_presenter()
misty.miauler()
\`\`\`

\`\`\`output
Je suis Rex, j'ai 3 an(s).
Je suis un Berger Allemand.
Rex : Ouaf Ouaf !
Rex mange.

Je suis Misty, j'ai 5 an(s).
Misty : Miaou !
\`\`\`

### isinstance() et issubclass()

\`\`\`python
print(isinstance(rex, Chien))   # True
print(isinstance(rex, Animal))  # True ! (héritage)
print(isinstance(rex, Chat))    # False
print(issubclass(Chien, Animal)) # True
\`\`\`

\`\`\`output
True
True
False
True
\`\`\`

> 💡 \`super()\` appelle la méthode de la classe parente. Utilisez-le toujours dans \`__init__\` pour initialiser correctement la partie héritée.

> ✏️ **Exercice** : Créez une hiérarchie : \`Vehicule\` (vitesse_max, carburant) → \`Voiture\` (nb_portes) → \`VoitureElectrique\` (autonomie_km). Chaque classe avec ses méthodes spécifiques.
`),

        lesson("Méthodes spéciales (dunder methods)", `
## Les méthodes spéciales

Les **méthodes spéciales** (ou "dunder methods") permettent de définir le comportement d'un objet avec les opérateurs Python.

### Les plus importantes

\`\`\`python
class Vecteur:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __str__(self):
        """Représentation lisible (pour print)."""
        return f"Vecteur({self.x}, {self.y})"
    
    def __repr__(self):
        """Représentation technique (pour les devs)."""
        return f"Vecteur(x={self.x}, y={self.y})"
    
    def __add__(self, autre):
        """Opérateur + entre deux vecteurs."""
        return Vecteur(self.x + autre.x, self.y + autre.y)
    
    def __mul__(self, scalaire):
        """Multiplication par un scalaire."""
        return Vecteur(self.x * scalaire, self.y * scalaire)
    
    def __len__(self):
        """Longueur du vecteur (arrondie)."""
        import math
        return int(math.sqrt(self.x**2 + self.y**2))
    
    def __eq__(self, autre):
        """Comparaison d'égalité."""
        return self.x == autre.x and self.y == autre.y

v1 = Vecteur(3, 4)
v2 = Vecteur(1, 2)

print(v1)              # __str__
print(v1 + v2)         # __add__
print(v1 * 2)          # __mul__
print(len(v1))         # __len__
print(v1 == Vecteur(3, 4))  # __eq__
\`\`\`

\`\`\`output
Vecteur(3, 4)
Vecteur(4, 6)
Vecteur(6, 8)
5
True
\`\`\`

### Méthodes utiles

| Méthode | Déclenchée par |
|---|---|
| \`__str__\` | \`print(obj)\`, \`str(obj)\` |
| \`__repr__\` | Mode interactif, \`repr(obj)\` |
| \`__len__\` | \`len(obj)\` |
| \`__add__\` | \`obj + autre\` |
| \`__eq__\` | \`obj == autre\` |
| \`__lt__\` | \`obj < autre\` |
| \`__getitem__\` | \`obj[index]\` |
| \`__contains__\` | \`element in obj\` |

> ✏️ **Exercice** : Créez une classe \`Temperature\` qui peut être créée en Celsius, et peut être ajoutée, comparée, et affichée proprement (ex: "25.0°C (77.0°F)").
`),

        lesson("Encapsulation et propriétés", `
## Encapsulation et @property

### Le principe d'encapsulation

L'encapsulation protège les données internes d'une classe.

\`\`\`python
class CompteBancaire:
    def __init__(self, proprietaire, solde_initial=0):
        self.proprietaire = proprietaire
        self.__solde = solde_initial  # Attribut privé (__)
        self.__historique = []
    
    @property
    def solde(self):
        """Getter : lire le solde."""
        return self.__solde
    
    @solde.setter
    def solde(self, montant):
        """Setter : impossible de mettre un solde négatif."""
        raise AttributeError("Utilisez deposer() ou retirer()")
    
    def deposer(self, montant):
        if montant <= 0:
            raise ValueError("Le montant doit être positif")
        self.__solde += montant
        self.__historique.append(f"+{montant:.2f}€")
        print(f"✅ Dépôt de {montant:.2f}€. Nouveau solde : {self.__solde:.2f}€")
    
    def retirer(self, montant):
        if montant <= 0:
            raise ValueError("Le montant doit être positif")
        if montant > self.__solde:
            raise ValueError("Solde insuffisant")
        self.__solde -= montant
        self.__historique.append(f"-{montant:.2f}€")
        print(f"✅ Retrait de {montant:.2f}€. Solde restant : {self.__solde:.2f}€")
    
    def afficher_historique(self):
        print(f"📊 Historique de {self.proprietaire} :")
        for op in self.__historique:
            print(f"   {op}")

compte = CompteBancaire("Alice", 1000)
compte.deposer(500)
compte.retirer(200)
print(f"Solde actuel : {compte.solde:.2f}€")
compte.afficher_historique()
\`\`\`

\`\`\`output
✅ Dépôt de 500.00€. Nouveau solde : 1500.00€
✅ Retrait de 200.00€. Solde restant : 1300.00€
Solde actuel : 1300.00€
📊 Historique de Alice :
   +500.00€
   -200.00€
\`\`\`

> 💡 Les attributs préfixés par \`__\` (double underscore) sont "privés" par convention. Python les renomme en \`_NomClasse__attribut\` pour éviter les collisions — c'est le "name mangling".

> ✏️ **Exercice** : Créez une classe \`Thermostat\` avec une température qui ne peut pas dépasser 100°C ni descendre sous -50°C. Utilisez \`@property\` pour valider.
`, [
          {
            question: "Quelle méthode spéciale est appelée par print(objet) ?",
            options: [
              { text: "__repr__", correct: false },
              { text: "__print__", correct: false },
              { text: "__str__", correct: true },
              { text: "__display__", correct: false },
            ]
          },
          {
            question: "Que signifie super() dans une méthode d'une sous-classe ?",
            options: [
              { text: "Appelle la méthode de la sous-classe elle-même", correct: false },
              { text: "Appelle la méthode de la classe parente", correct: true },
              { text: "Crée une super-instance", correct: false },
              { text: "Accède aux attributs statiques", correct: false },
            ]
          },
          {
            question: "Que fait l'héritage en POO ?",
            options: [
              { text: "Copie une classe", correct: false },
              { text: "Une classe enfant hérite des attributs et méthodes de la classe parente", correct: true },
              { text: "Crée une instance automatiquement", correct: false },
              { text: "Protège les données d'une classe", correct: false },
            ]
          }
        ]),
      ]
    },

    /* ══════════════════════════════════════════
       MODULE 16 : Projets Pratiques
    ══════════════════════════════════════════ */
    {
      title: "Module 16 — Projets Pratiques",
      lessons: [
        lesson("Projet 1 : Le Jeu du Pendu", `
## Projet — Jeu du Pendu

Un jeu classique qui utilise : listes, chaînes, boucles, conditions et fonctions.

\`\`\`python
import random

# Liste de mots
MOTS = ["python", "programmation", "ordinateur", "algorithme",
        "variable", "fonction", "boucle", "dictionnaire",
        "classe", "heritage"]

def choisir_mot():
    return random.choice(MOTS)

def afficher_pendu(erreurs):
    etapes = [
        "\\n   +---+\\n   |   |\\n       |\\n       |\\n       |\\n       |\\n =========",
        "\\n   +---+\\n   |   |\\n   O   |\\n       |\\n       |\\n       |\\n =========",
        "\\n   +---+\\n   |   |\\n   O   |\\n   |   |\\n       |\\n       |\\n =========",
        "\\n   +---+\\n   |   |\\n   O   |\\n  /|   |\\n       |\\n       |\\n =========",
        "\\n   +---+\\n   |   |\\n   O   |\\n  /|\\\\  |\\n       |\\n       |\\n =========",
        "\\n   +---+\\n   |   |\\n   O   |\\n  /|\\\\  |\\n  /    |\\n       |\\n =========",
        "\\n   +---+\\n   |   |\\n   O   |\\n  /|\\\\  |\\n  / \\\\  |\\n       |\\n =========",
    ]
    print(etapes[erreurs])

def jouer():
    mot = choisir_mot()
    lettres_trouvees = set()
    lettres_essayees = set()
    erreurs = 0
    max_erreurs = 6

    print("\\n" + "="*40)
    print("       LE JEU DU PENDU")
    print("="*40)

    while erreurs < max_erreurs:
        afficher_pendu(erreurs)
        
        # Afficher le mot masqué
        mot_affiche = " ".join(l if l in lettres_trouvees else "_" for l in mot)
        print(f"\\n  Mot : {mot_affiche}")
        print(f"  Erreurs : {erreurs}/{max_erreurs}")
        
        if lettres_essayees:
            print(f"  Essayées : {', '.join(sorted(lettres_essayees))}")
        
        # Victoire ?
        if all(l in lettres_trouvees for l in mot):
            print(f"\\n🎉 BRAVO ! Vous avez trouvé : '{mot}' !")
            return True
        
        # Saisie
        while True:
            lettre = input("\\n  Lettre : ").lower().strip()
            if len(lettre) == 1 and lettre.isalpha():
                if lettre in lettres_essayees:
                    print(f"  ⚠️ Vous avez déjà essayé '{lettre}'")
                else:
                    break
            else:
                print("  Entrez une seule lettre !")
        
        lettres_essayees.add(lettre)
        
        if lettre in mot:
            lettres_trouvees.add(lettre)
            print(f"  ✅ Bonne lettre !")
        else:
            erreurs += 1
            print(f"  ❌ '{lettre}' n'est pas dans le mot.")
    
    afficher_pendu(erreurs)
    print(f"\\n😢 Perdu ! Le mot était : '{mot}'")
    return False

jouer()
\`\`\`

> ✏️ **Améliorations** : Ajoutez des catégories de mots, un système de score, plusieurs difficultés (nombre de tentatives), ou lisez les mots depuis un fichier externe.
`),

        lesson("Projet 2 : Gestionnaire de contacts avancé", `
## Projet — Gestionnaire de Contacts

Un gestionnaire complet avec POO et sauvegarde JSON.

\`\`\`python
import json
import os
from datetime import datetime

class Contact:
    def __init__(self, prenom, nom, telephone, email="", notes=""):
        self.prenom = prenom
        self.nom = nom
        self.telephone = telephone
        self.email = email
        self.notes = notes
        self.date_ajout = datetime.now().strftime("%Y-%m-%d %H:%M")
    
    def afficher(self):
        print(f"\\n  👤 {self.prenom} {self.nom.upper()}")
        print(f"     📞 {self.telephone}")
        if self.email:
            print(f"     📧 {self.email}")
        if self.notes:
            print(f"     📝 {self.notes}")
        print(f"     📅 Ajouté le {self.date_ajout}")
    
    def to_dict(self):
        return self.__dict__
    
    @classmethod
    def from_dict(cls, data):
        c = cls(data["prenom"], data["nom"], data["telephone"],
                data.get("email", ""), data.get("notes", ""))
        c.date_ajout = data.get("date_ajout", "")
        return c


class GestionnaireContacts:
    FICHIER = "contacts.json"
    
    def __init__(self):
        self.contacts = {}
        self.charger()
    
    def charger(self):
        if os.path.exists(self.FICHIER):
            with open(self.FICHIER, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.contacts = {k: Contact.from_dict(v) for k, v in data.items()}
    
    def sauvegarder(self):
        with open(self.FICHIER, "w", encoding="utf-8") as f:
            json.dump({k: v.to_dict() for k, v in self.contacts.items()},
                      f, indent=2, ensure_ascii=False)
    
    def ajouter(self, contact):
        cle = f"{contact.prenom.lower()}_{contact.nom.lower()}"
        self.contacts[cle] = contact
        self.sauvegarder()
        print(f"✅ {contact.prenom} {contact.nom} ajouté !")
    
    def rechercher(self, terme):
        terme = terme.lower()
        resultats = [c for c in self.contacts.values()
                     if terme in c.prenom.lower() or terme in c.nom.lower()
                     or terme in c.telephone]
        return resultats
    
    def lister(self):
        if not self.contacts:
            print("  Aucun contact.")
            return
        for contact in sorted(self.contacts.values(), key=lambda c: c.nom):
            contact.afficher()
    
    def supprimer(self, nom):
        cles_a_supprimer = [k for k, c in self.contacts.items()
                            if nom.lower() in c.nom.lower() or nom.lower() in c.prenom.lower()]
        for cle in cles_a_supprimer:
            del self.contacts[cle]
        if cles_a_supprimer:
            self.sauvegarder()
            print(f"🗑️ {len(cles_a_supprimer)} contact(s) supprimé(s).")

# Démonstration
gestionnaire = GestionnaireContacts()

alice = Contact("Alice", "Martin", "06 12 34 56 78", "alice@exemple.com")
bob = Contact("Bob", "Dupont", "07 98 76 54 32", notes="Collègue de bureau")

gestionnaire.ajouter(alice)
gestionnaire.ajouter(bob)

print("\\n--- Recherche 'al' ---")
for c in gestionnaire.rechercher("al"):
    c.afficher()
\`\`\`

\`\`\`output
✅ Alice Martin ajouté !
✅ Bob Dupont ajouté !

--- Recherche 'al' ---

  👤 Alice MARTIN
     📞 06 12 34 56 78
     📧 alice@exemple.com
     📅 Ajouté le 2024-01-15 14:30
\`\`\`

> ✏️ **Améliorations** : Ajoutez la modification d'un contact existant, l'export en CSV, et une interface menu complète.
`),

        lesson("Projet Final : Application de Gestion Complète", `
## Projet Final — Mini Application de Gestion

Ce projet final combine tous les concepts de la formation dans une application réaliste.

### Système de Gestion d'une Bibliothèque

\`\`\`python
import json
from datetime import datetime, timedelta

class Livre:
    def __init__(self, isbn, titre, auteur, annee, genre):
        self.isbn = isbn
        self.titre = titre
        self.auteur = auteur
        self.annee = annee
        self.genre = genre
        self.disponible = True
        self.emprunts = []
    
    def __str__(self):
        statut = "✅ Disponible" if self.disponible else "❌ Emprunté"
        return f"[{self.isbn}] '{self.titre}' - {self.auteur} ({self.annee}) | {statut}"
    
    def to_dict(self):
        return {k: v for k, v in self.__dict__.items() if k != 'emprunts'}


class Membre:
    def __init__(self, id_membre, prenom, nom, email):
        self.id_membre = id_membre
        self.prenom = prenom
        self.nom = nom
        self.email = email
        self.livres_empruntes = []
    
    def __str__(self):
        return f"#{self.id_membre} {self.prenom} {self.nom} ({len(self.livres_empruntes)} emprunts)"


class Bibliotheque:
    def __init__(self, nom):
        self.nom = nom
        self.livres = {}
        self.membres = {}
        self.emprunts = []
        self._initialiser_demo()
    
    def _initialiser_demo(self):
        """Données de démonstration."""
        for isbn, titre, auteur, annee, genre in [
            ("978-1", "Python Crash Course", "Eric Matthes", 2023, "Informatique"),
            ("978-2", "Le Petit Prince", "Antoine de Saint-Exupéry", 1943, "Fiction"),
            ("978-3", "Clean Code", "Robert Martin", 2008, "Informatique"),
            ("978-4", "L'Alchimiste", "Paulo Coelho", 1988, "Roman"),
            ("978-5", "Automate the Boring Stuff", "Al Sweigart", 2020, "Informatique"),
        ]:
            self.livres[isbn] = Livre(isbn, titre, auteur, annee, genre)
        
        for id, prenom, nom, email in [
            (1, "Alice", "Martin", "alice@ex.com"),
            (2, "Bob", "Dupont", "bob@ex.com"),
        ]:
            self.membres[id] = Membre(id, prenom, nom, email)
    
    def rechercher_livres(self, terme="", genre=None):
        resultats = []
        for livre in self.livres.values():
            match_terme = not terme or terme.lower() in livre.titre.lower() or terme.lower() in livre.auteur.lower()
            match_genre = not genre or livre.genre.lower() == genre.lower()
            if match_terme and match_genre:
                resultats.append(livre)
        return resultats
    
    def emprunter(self, id_membre, isbn, jours=14):
        if id_membre not in self.membres:
            raise ValueError(f"Membre #{id_membre} introuvable")
        if isbn not in self.livres:
            raise ValueError(f"Livre {isbn} introuvable")
        
        livre = self.livres[isbn]
        membre = self.membres[id_membre]
        
        if not livre.disponible:
            raise ValueError(f"'{livre.titre}' n'est pas disponible")
        
        livre.disponible = False
        membre.livres_empruntes.append(isbn)
        
        emprunt = {
            "isbn": isbn,
            "id_membre": id_membre,
            "date_emprunt": datetime.now().strftime("%Y-%m-%d"),
            "date_retour_prevue": (datetime.now() + timedelta(days=jours)).strftime("%Y-%m-%d")
        }
        self.emprunts.append(emprunt)
        
        print(f"📚 '{livre.titre}' emprunté par {membre.prenom} jusqu'au {emprunt['date_retour_prevue']}")
    
    def retourner(self, isbn):
        if isbn not in self.livres:
            raise ValueError(f"Livre {isbn} introuvable")
        
        livre = self.livres[isbn]
        if livre.disponible:
            raise ValueError(f"'{livre.titre}' n'est pas emprunté")
        
        livre.disponible = True
        
        for emprunt in self.emprunts:
            if emprunt["isbn"] == isbn and "date_retour_reel" not in emprunt:
                emprunt["date_retour_reel"] = datetime.now().strftime("%Y-%m-%d")
                id_membre = emprunt["id_membre"]
                if isbn in self.membres[id_membre].livres_empruntes:
                    self.membres[id_membre].livres_empruntes.remove(isbn)
                break
        
        print(f"✅ '{livre.titre}' retourné avec succès.")
    
    def rapport(self):
        print(f"\\n{'='*50}")
        print(f"   RAPPORT — {self.nom}")
        print(f"{'='*50}")
        print(f"  Total livres      : {len(self.livres)}")
        print(f"  Disponibles       : {sum(1 for l in self.livres.values() if l.disponible)}")
        print(f"  Empruntés         : {sum(1 for l in self.livres.values() if not l.disponible)}")
        print(f"  Membres           : {len(self.membres)}")
        print(f"  Total emprunts    : {len(self.emprunts)}")
        
        genres = {}
        for livre in self.livres.values():
            genres[livre.genre] = genres.get(livre.genre, 0) + 1
        print(f"\\n  Livres par genre :")
        for genre, count in sorted(genres.items()):
            print(f"    • {genre}: {count}")

# ─── Démonstration ───
biblio = Bibliotheque("BiblioPython")

print("📚 CATALOGUE COMPLET")
for livre in biblio.rechercher_livres():
    print(" ", livre)

print("\\n📗 LIVRES INFORMATIQUE")
for livre in biblio.rechercher_livres(genre="Informatique"):
    print(" ", livre)

biblio.emprunter(1, "978-1")
biblio.emprunter(2, "978-3")

print("\\n📌 APRÈS EMPRUNTS")
for livre in biblio.rechercher_livres():
    print(" ", livre)

biblio.retourner("978-1")
biblio.rapport()
\`\`\`

\`\`\`output
📚 CATALOGUE COMPLET
  [978-1] 'Python Crash Course' - Eric Matthes (2023) | ✅ Disponible
  [978-2] 'Le Petit Prince' - Antoine de Saint-Exupéry (1943) | ✅ Disponible
  [978-3] 'Clean Code' - Robert Martin (2008) | ✅ Disponible
  [978-4] 'L'Alchimiste' - Paulo Coelho (1988) | ✅ Disponible
  [978-5] 'Automate the Boring Stuff' - Al Sweigart (2020) | ✅ Disponible

📗 LIVRES INFORMATIQUE
  [978-1] 'Python Crash Course' - Eric Matthes (2023) | ✅ Disponible
  [978-3] 'Clean Code' - Robert Martin (2008) | ✅ Disponible
  [978-5] 'Automate the Boring Stuff' - Al Sweigart (2020) | ✅ Disponible

📚 'Python Crash Course' emprunté par Alice jusqu'au 2024-01-29
📚 'Clean Code' emprunté par Bob jusqu'au 2024-01-29

📌 APRÈS EMPRUNTS
  [978-1] 'Python Crash Course' - Eric Matthes (2023) | ❌ Emprunté
  ...
✅ 'Python Crash Course' retourné avec succès.

==================================================
   RAPPORT — BiblioPython
==================================================
  Total livres      : 5
  Disponibles       : 4
  Empruntés         : 1
  Membres           : 2
  Total emprunts    : 2

  Livres par genre :
    • Fiction: 1
    • Informatique: 3
    • Roman: 1
\`\`\`

### Félicitations !

Vous avez terminé la formation **Python — De Zéro à Intermédiaire** !

Vous maîtrisez maintenant :
- ✅ Les variables et types de données
- ✅ Les structures de contrôle (if, for, while)
- ✅ Les fonctions et la portée
- ✅ Les structures de données (listes, tuples, sets, dictionnaires)
- ✅ La gestion des fichiers et JSON
- ✅ La gestion des exceptions
- ✅ Les modules et packages
- ✅ La Programmation Orientée Objet

### Prochaines étapes

1. **Django / Flask** — Créez des applications web
2. **Pandas / NumPy** — Analysez des données
3. **Pygame** — Développez des jeux
4. **TensorFlow / PyTorch** — Apprenez l'IA

> 💡 La meilleure façon de progresser : **construire des projets réels** qui vous motivent. Choisissez un projet personnel et lancez-vous !
`, [
          {
            question: "Parmi ces projets, lequel est le plus adapté à un débutant Python ?",
            options: [
              { text: "Créer un système d'IA avec TensorFlow", correct: false },
              { text: "Développer un jeu de pendu avec des listes et boucles", correct: true },
              { text: "Construire un compilateur Python", correct: false },
              { text: "Créer un système d'exploitation", correct: false },
            ]
          },
          {
            question: "Quelle bibliothèque Python est utilisée pour l'analyse de données ?",
            options: [
              { text: "pygame", correct: false },
              { text: "flask", correct: false },
              { text: "pandas", correct: true },
              { text: "tkinter", correct: false },
            ]
          },
          {
            question: "Quel format est le plus utilisé pour sauvegarder des données structurées en Python ?",
            options: [
              { text: "XML", correct: false },
              { text: "JSON", correct: true },
              { text: "YAML", correct: false },
              { text: "CSV", correct: false },
            ]
          }
        ]),
      ]
    },
  ]
};

/* ─────────────────────────────────────────────
   SEED FUNCTION
───────────────────────────────────────────── */
async function seed() {
  console.log("🐍 Démarrage du seed — Formation Python...\n");

  // Vérification idempotente
  const existing = await db
    .select()
    .from(formationsTable)
    .where(eq(formationsTable.slug, SLUG));

  if (existing.length > 0) {
    console.log(`✅ La formation "${SLUG}" existe déjà. Rien à insérer.`);
    console.log(`   ID : ${existing[0].id} | Titre : ${existing[0].title}`);
    process.exit(0);
  }

  console.log("📝 Insertion de la formation...");

  // 1. Formation
  const [formation] = await db
    .insert(formationsTable)
    .values({
      slug: FORMATION.slug,
      title: FORMATION.title,
      description: FORMATION.description,
      category: FORMATION.category,
      active: true,
    })
    .returning();

  console.log(`✅ Formation créée (ID: ${formation.id})`);

  let totalLecons = 0;
  let totalQuizzes = 0;

  // 2. Modules + Leçons + Quiz
  for (let mi = 0; mi < FORMATION.modules.length; mi++) {
    const modData = FORMATION.modules[mi];

    const [module] = await db
      .insert(modulesTable)
      .values({
        formationId: formation.id,
        title: modData.title,
        order: mi + 1,
      })
      .returning();

    console.log(`  📦 Module ${mi + 1}: ${modData.title} (${modData.lessons.length} leçons)`);

    for (let li = 0; li < modData.lessons.length; li++) {
      const lessonData = modData.lessons[li];

      const [lecon] = await db
        .insert(lessonsTable)
        .values({
          moduleId: module.id,
          title: lessonData.title,
          theory: lessonData.theory.trim(),
          mediaType: "none",
          order: li + 1,
        })
        .returning();

      totalLecons++;

      // Quiz
      if (lessonData.quizzes && lessonData.quizzes.length > 0) {
        for (let qi = 0; qi < lessonData.quizzes.length; qi++) {
          const quizData = lessonData.quizzes[qi];

          const [quiz] = await db
            .insert(quizzesTable)
            .values({
              lessonId: lecon.id,
              question: quizData.question,
              order: qi + 1,
            })
            .returning();

          for (let oi = 0; oi < quizData.options.length; oi++) {
            const opt = quizData.options[oi];
            await db.insert(quizOptionsTable).values({
              quizId: quiz.id,
              text: opt.text,
              isCorrect: opt.correct,
              order: oi + 1,
            });
          }

          totalQuizzes++;
        }
      }
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("🎉 SEED TERMINÉ AVEC SUCCÈS !");
  console.log("=".repeat(50));
  console.log(`  Formation : ${FORMATION.title}`);
  console.log(`  Modules   : ${FORMATION.modules.length}`);
  console.log(`  Leçons    : ${totalLecons}`);
  console.log(`  Quiz      : ${totalQuizzes}`);
  console.log("=".repeat(50));

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Erreur lors du seed :", err);
  process.exit(1);
});
