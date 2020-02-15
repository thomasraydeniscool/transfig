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

> Why not actually take advantage of a schema-less database?

A NoSQL database does not enforce document structure you don't need to have migrations or a concept of document versions at all.

So instead of migrating the data, the concept is to virtually map legacy data to the expected model at runtime.

## Contents

- [Motivation and Concept](#motivation-and-concept)
- [Usage and Examples](#usage-and-examples)
- [Current Caveats](#current-caveats)
- [API documentation](#api-documentation)

## Motivation and Concept

I was working on a project that had a desktop & mobile application both connected to the cloud (REST API). This made it extremely hard to deploy breaking changes on the database models because it would break older versions, and it is guaranteed that your users will update to the latest version.

With a traditional SQL database you would write migration scripts and run migrations on the database on a release.

##### However migrations presented with a few problems

- If you have cloud based software and run migrations on the server, if the clients are not updated to understand the new schema the clients will break.
- Writing migration scripts, running them, and managing document versions is tedious.
- By migrating data you are forcing older versions of the software to become obsolete, preventing the development of long term support software.
- Migrations is a SQL concept and not designed for nor very well supported in NoSQL.

##### How does this work & why is it better?

- A document will seamlessly update to the most latest version of the model. This works because old fields will only be mapped if the new field doesn't exist and once the field has been updated it will be saved in the new fields place.

- A document has the ability to be supported since the time it was created\*\* and a document will work even if users are using inconsistent versions and vastly different clients simultaneously. This is because old fields are not removed once the document has been updated and old fields do not interfere with newer fields.

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

These flaws in the concept I have not yet found a solution to and I will be actively working on solving these.

- **New data does not propagate backwards in time.** This means that if you update a documents data inside a newer version of the app only the original data will exist in legacy versions.

- **Data cannot be cleaned.** Older documents have the possibility to cause unnecessary bloat, causing longer response times and more database usage.

- **Mutating data on the same field can break support for older clients.** For example, v1.0.0 expects `mobile` to be a number and v1.1.0 expects `mobile` to be a string. Once `mobile` is updated to v1.1.0 it will break in v1.0.0.

## API documentation

Comming soon
