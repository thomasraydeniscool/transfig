# transfig

Transfigure your JavaScript objects!

![Rat Goblet](https://raw.githubusercontent.com/thomasraydeniscool/transfig/master/image.jpg)

## Migrations

```typescript
import { Schema, Transformer, Migration, Migrator } from 'transfig';
import { schema_1_0_0, transform_1_0_0 } from './1.0.0.ts';

export const schema_1_1_0 = new Schema(
  {
    name: Schema.types.string(),
    hello: Schema.types.number(),
    created: Schema.types.date(),
    meta: Schema.types.any(),
    isCool: Schema.types.boolean(),
    list: Schema.types.array()
  },
  { strict: false }
);

export const transform_1_1_0 = new Transformer(
  {
    name(context) {
      return `${context.get('firstName')} ${context.get('lastName')}`;
    }
    isCool(context) {
      return !context.get('isBad');
    },
    list(context) {
      return context.get('items').map(i => i.data);
    },
    meta: 'local'
  },
  {
    inclusive: true // Keys that are not specified are included as-is
  }
);

export const v1_1_0 = new Migration({
  name: 'charlie',
  up: {
    key: 'v',
    target: '1.1.0',
    schema: schema_1_1_0,
    transformer: transform_1_1_0,
    action(context) {
      const target = context.transform(context.document); // Transform object

      context.validate(target) // Validate against schema

      return target;
    }
  },
  down: {
    key: 'version',
    target: null, // Unknown document version
    schema: schema_1_0_0,
    transformer: transform_1_0_0
  }
});

const migrate = new Migrator([v1_0_0, v1_1_0]);

const result = migrate.up(document);

const result = migrate.down(document);

const result = migrate.up(document, 'charlie' | '1.1.0');

const result = migrate.down(document, 'charlie');

const result = migrate.is(document, 'charlie');

const result = migrate.execute(document, {
  migrations: ['charlie', 'some-other-name'], // Executed in order of array provided
  action: 'up' | 'down'
});
```
