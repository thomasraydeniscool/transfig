<div align="center">
  <h1>Transfig</h1>
  <b>Migrations <i>designed</i> for NoSQL</b>
  <br />
  <br />
  <img src="image.jpg" alt="Harry Potter Rat Goblet" />
  <br />
  <br />
  <p>:warning: This is currently a work in progress :warning:</p>
  <br />
</div>

```
npm i transfig
```

SQL has made database migrations the industry standard when making breaking changes to a database model.

Transfig aims to answer one question...

> Why not actually take advantage of a schema-less database?

A NoSQL database does not enforce document structure so you don't need to have migrations or a concept of document versions at all.

So instead of migrating the data, Transfig explores the concept of virtually mapping legacy data to the expected model at runtime. :thinking:

## Contents

- [Motivation and Concept](#motivation-and-concept)
- [Usage and Examples](#usage-and-examples)
- [Current Caveats](#current-caveats)
- [API documentation](#api-documentation)

## Motivation and Concept

I was working on a project with a cloud based architecture with desktop & mobile clients all connected to a single REST API that would share data between each other. This made it extremely hard to deploy any breaking changes on the database models, because it would break older versions of the clients.

With a traditional SQL database you would write migration scripts and run migrations on the database on a release. But...

#### Traditional migrations presented a few problems

- **In a cloud based architecture running migrations on the server will break the clients.** You cannot simply run a server-side migration because if the clients are not updated to understand the new schema they will break, and you cannot rely and users keeping their applications up-to-date.
- **By migrating data you are forcing older versions of the software to become obsolete.** This discourages / hinders the development of LTS software. It is possible to write migrations to downgrade the database to a previous version, however, it's unlikely to be done in production because of many shortfalls.
- **Writing migration scripts, running them, and managing document versions is tedious.**
- **Database migrations are a SQL concept and not designed for NoSQL nor very well supported.**

#### So how does Transfig work & why is it better?

- **A document will seamlessly update to the most latest version of the model.**

  1. Legacy fields are only mapped to new fields if the new field doesn't exist.
  2. Only once a field's value is changed it is stored in its new location.

- **A document has the ability to be supported since the time it was created,** and a document will work even if users are using inconsistent versions and vastly different clients simultaneously (as long has the document is used in a version >= the one it was created in, [see caveats](#current-caveats)).

## Usage and Examples

#### Basic usage

```typescript
import tf from "transfig";

interface ILegacyUser {
  first_name: string;
  last_name: string;
}

const LegacyUser = new tf.Mapping<ILegacyUser>({
  map: {
    given_name: "first_name",
    family_name: "last_name"
  }
});

interface IUser {
  given_name: string;
  family_name: string;
}

const UserParser = new tf.Parser<IUser>({
  mappings: [LegacyUser]
});

const legacy_user: ILegacyUser = {
  first_name: "Thomas",
  last_name: "Rayden"
};

const user: IUser & LegacyUser = UserParser.parse(legacy_user);
/**
 * {
 *   given_name: "Thomas",
 *   family_name: "Rayden",
 *   first_name: "Thomas",
 *   last_name: "Rayden"
 * }
 */
```

## Current Caveats

These flaws in the concept I have not yet found a solution to and I will be actively working on solving these. Some of them will need to be solved before this library can be used in production.

- **New data does not propagate backwards in time.** This means that if you update a document's field inside a newer version of the app, that new data will not exist in older versions, the field will contain its original value.

- **Data is not cleaned.** Older documents have the possibility to cause unnecessary bloat, causing longer response times and more database usage.

- **Mutating data on the same field can break support for older clients.**

  1. `v1.0.0` expects `mobile` to be a `number`.
  2. `v1.1.0` expects `mobile` to be a `string`.
  3. Once `mobile` is updated in `v1.1.0` it will break in `v1.0.0`.

- **Creating a document in a newer version will not have the required fields work in older versions.**

  1. User has `v1.1.0` on desktop & `v1.0.0` on mobile.
  2. User creates document on desktop (`v1.1.0`).
  3. That document will not be supported on their mobile version (`v1.0.0`).

## API documentation

Coming soon
