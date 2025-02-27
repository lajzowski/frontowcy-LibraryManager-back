#Projekt końcowy Frontowcy - LibraryManager (BACKEND)

# LibraryManager (BACKEND)

LibraryManager to aplikacja do zarządzania biblioteką. Projekt został stworzony zgodnie ze specyfikacją.

## Funkcje

- Zarządzanie książkami: dodawanie, edycja i usuwanie książek w bazie danych.
- Obsługa użytkowników: uwierzytelnianie i autoryzacja.
- API REST: umożliwia komunikację pomiędzy frontendem i backendem.
- Wsparcie dla baz danych SQL za pomocą TypeORM.
- Walidacja danych przy użyciu Class-Validator.
- Logowanie zapytań i obsługiwanych błędów.

## Stos technologiczny

- **Framework:** NestJS (v11)
- **Język:** TypeScript
- **Baza danych:** MySQL z obsługą dzięki mysql2 i TypeORM
- **Obsługa uwierzytelniania:** Passport (v0.7.0) z Passport-JWT

## Wymagania

Przed uruchomieniem lub zbudowaniem projektu upewnij się, że posiadasz zainstalowane:

- Node.js (wersja 18 lub nowsza),
- npm (Node Package Manager),
- MySQL (do lokalnego hostowania bazy danych).

Frontend wymaga działania tego backendu jako punktu końcowego API.

## Instalacja

1. Sklonuj repozytorium:

   ```bash
   git clone https://github.com/lajzowski/frontowcy-LibraryManager-back
   ```

2. Przejdź do katalogu projektu:

   ```bash
   cd LibraryManager-Backend
   ```

3. Zainstaluj zależności:

   ```bash
   npm install
   ```

4. Skonfiguruj zmienne środowiskowe, tworząc plik `.env` w katalogu głównym projektu na podstawie pliku `.env.example`.

   Przykład zawartości `.env`:
   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=3306
   DATABASE_USERNAME=root
   DATABASE_PASSWORD=yourpassword
   DATABASE_NAME=library
   JWT_SECRET=yoursecretkey
   PORT=3000
   ```

## Rozwój

Aby uruchomić aplikację w trybie deweloperskim, użyj:

```bash
npm run start:dev
```

Backend będzie dostępny pod adresem `http://localhost:3000`.

## Budowanie projektu

Aby stworzyć wersję produkcyjną, uruchom:

```bash
npm run build
```

Uruchom aplikację zbudowaną do produkcji za pomocą:

```bash
npm run start:prod
```

## Testowanie

Projekt zawiera automatyczne testy jednostkowe i integracyjne. Aby uruchomić testy, wykonaj:

```bash
npm test
```

Lub aby obserwować testy w działaniu:

```bash
npm run test:watch
```

## Lintowanie i formatowanie

Aby przeprowadzić lintowanie kodu i naprawić problemy ze stylem, użyj:

```bash
npm run lint
```

Formatowanie kodu za pomocą Prettiera możesz uruchomić poleceniem:

```bash
npm run format
```

## Informacje Dodatkowe

Backend został stworzony wyłącznie na potrzeby kursu "Frontowcy" jako projekt edukacyjny. Nie odzwierciedla w pełni
moich umiejętności programistycznych, a ze względu na uproszczoną formę nie jest przeznaczony do użytku w środowisku
produkcyjnym.

## Licencja

Ten projekt jest licencjonowany na zasadach licencji **MIT**. Szczegóły znajdziesz w pliku [LICENSE](./LICENSE).

## Podziękowania

- [NestJS](https://nestjs.com/)
- [MySQL](https://www.mysql.com/)
- [TypeORM](https://typeorm.io/)
- [Passport](http://www.passportjs.org/)
- [Jest](https://jestjs.io/)
