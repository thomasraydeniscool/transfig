export interface TransfigSchemaDefinition {
  [key: string]: TransfigSchemaType;
}

export interface TransfigSchemaOptions {
  strict?: boolean;
}

export interface TransfigSchemaTypes {
  string: () => TransfigSchemaType;
}

export interface TransfigSchemaType {
  type: string;
  compare: (value: any) => boolean;
}

class Schema {
  public static types: TransfigSchemaTypes = {
    string() {
      return {
        type: 'string',
        compare(value: any) {
          return typeof value === 'string';
        }
      };
    }
  };

  private definition: TransfigSchemaDefinition;
  private options: TransfigSchemaOptions;

  constructor(
    definition: TransfigSchemaDefinition,
    options: TransfigSchemaOptions = {}
  ) {
    this.definition = definition;
    this.options = options;
  }

  public validate(input: any, options: TransfigSchemaOptions = this.options) {
    Object.keys(input).forEach(key => {
      const value = input[key];
      const field = this.definition[key];
      if (field) {
        if (field.compare(value) !== true) {
          throw new Error(`Schema validation failed at key ${key}`);
        }
      } else if (options.strict) {
        throw new Error(`Unknown key ${key} found in input`);
      }
    });
  }
}

export default Schema;
