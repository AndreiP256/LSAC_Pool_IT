# LSAC_Pool_IT
Aceasta este provocarea tehnică pentru departamentul IT LSAC din 2023 pentru admitere.
Constă în crearea unui site de sondaje cu funcționalități de autentificare, înregistrare, creare/ștergere de sondaje și votare.

## Tehnologii folosite:
- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)
- [Axios](https://axios-http.com/)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Bootstrap](https://getbootstrap.com/)

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Instalare
- În folderul frontend, rulează "npm install" și "npm start"
- În folderul backend, rulează "npm install" și "npm start"
- Dacă frontend-ul rulează corect, va afișa o aplicație React pe localhost:3000
- Dacă backend-ul rulează corect, va afișa "Server is Running" și "Database Connected" în consolă
- De la acest punct, aplicația este complet funcțională

## Utilizare

După configurarea proiectului, poți utiliza aplicația navigând la `localhost:3000` în browserul tău. De acolo, poți să îți înregistrezi un utilizator nou, să te autentifici, să creezi și să ștergi sondaje, și să votezi în sondaje existente.

## Descriere Proiect

### Bază de date
Baza de date este găzduită pe clusterul meu MongoDB, orice adresă IP ar trebui să aibă acces, nu este nevoie să configurezi o bază de date locală.
Dacă însă preferi o bază de date locală pentru testare, în folderul backend, "db.js" conține conexiunea la baza de date, pe care o poți modifica acolo.

## Frontend
Frontend-ul este împărțit în mai multe componente și pagini.

### Pagini și Aplicație
Proiectul conține 2 pagini, pagina principală cu sondajele și toata funcționalitatea și o pagină Error404.
Aceste pagini sunt afișate folosind un router în fișierul "App.js", bara de navigare și subsolul fiind afișate întotdeauna.
Pagina principală preia toate sondajele din baza de date folosind o cerere de tip get și le salvează într-un array care este apoi mapat la mai multe componente poll.

### Navbar
Bara de navigare este un Navbar din Bootstrap React simplu care afișează dinamic butoanele de autentificare, înregistrare, delogare și creare sondaj în funcție de dacă utilizatorul este autentificat sau nu. Ea folosește contextul furnizat de backend în acest sens.

### Footer
Subsolul este doar un div în partea de jos a ecranului care conține paginile sociale ca imagini href.

### Autentificare
Autentificarea returnează un modal și un buton. Butonul este plasat în bara de navigare și modalul apare la clic pe buton.
În afară de design, fișierul login.js conține o cerere către backend pentru verificarea unui utilizator, care apoi returnează un jwt pentru autentificare. Apoi setează isLoggedIn local la true astfel încât să poată fi verificat și utilizat. De asemenea, salvează tokenul local.

### Înregistrare
Înregistrarea are aproape aceeași funcționalitate ca autentificarea, dar în loc să caute un utilizator, creează unul nou. Câmpurile de text sunt verificate atât de codul frontend (și backend-ul de asemenea) pentru a se potrivi criteriilor.

### Delogare
Delogarea șterge tokenul și setează isLoggedIn la false, după care da refresh la pagina.

### Creare Poll
Acest element creează un modal cu opțiuni pentru crearea sondajului, care sunt verificate și trimise la backend după. Utilizatorul care trimite cererea este procesat de backend din jwt token-ul său.

### Poll
Acesta este șablonul pentru fiecare sondaj din aplicație. Este o funcție care primește mai mulți parametri și creează un element de sondaj din aceștia. Butoanele de Votare și Ștergere sunt de asemenea afișate dinamic în funcție de starea de autentificare a utilizatorului și verificările backend-ului.

## Backend
Backend-ul este împărțit în diferite fișiere care se ocupă de diferite aspecte ale aplicației.

### Modele
În fișierul modelelor, sunt definite PollSchema, PollModel, UserSchema și UserModel pentru utilizare ulterioară în întreaga aplicație.

### Bază de date
Fișierul bazei de date se ocupă de conectarea la baza de date.

### Middleware de Autentificare
Fișierul Middleware de Autentificare se ocupă de verificarea tokenului jwt folosit pentru identificarea fiecărui utilizator și de asemenea descodifică UserID-ul pentru a putea fi folosit ulterior.

### Authentification Routes
În acest fișier sunt definite endpoint-urile pentru autentificare și creare utilizator nou.
- Autentificarea caută în baza de date după email și apoi compară parolele. Criptarea Bcrypt este folosită pentru a face o parola hash înainte de a o trimite în baza de date pentru verificare. În această secțiune, tokenul jwt este generat și returnat în răspuns.
- Secțiunea de înregistrare verifică cu regex pentru un email valid și o parolă validă, iar dacă cele două sunt corecte, hash-ează parola. După aceea, verifică baza de date pentru un Utilizator cu acel email care să nu existe deja și dacă nu este găsit, se creează un utilizator nou.

### CRUD
Acest fișier se ocupă de tot ce ține de sondaje.
-"Post" creează un nou sondaj cu opțiunile transmise prin cererea json și UserID-ul din tokenul jwt.
- "Get" returnează un json cu toate sondajele din baza de date.
- "Patch" folosește ID-ul sondajului pentru a modifica voturile și a adăuga utilizatorul curent la lista user_voted astfel încât să nu poată vota din nou (se verifică că poate vota).
- "Delete" elimină un sondaj din baza de date pe baza ID-ului său. Se verifică că utilizatorul care a solicitat ștergerea sondajului este proprietarul acestuia.

### Index
Fișierul index cuprinde un router care direcționează cererile către endpoint-urile definite în fișierele anterioare.

## Licență
Acest proiect și tot codul conținut în acest depozit aparține și este întreținut de Prusacov Andrei-Ionut. Copierea neautorizată a acestui proiect, prin orice mediu, este strict interzisă.
