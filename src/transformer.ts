import lives from 'lives';

export type TransfigTransformerFunction = (
  context: TransfigTransformerContext
) => any;

export interface TransfigTransformerDefinition {
  [key: string]: string | TransfigTransformerFunction;
}

export interface TransfigTransformerOptions {
  inclusive?: boolean;
}

export interface TransfigTransformerContext {
  get: (key: string) => any;
  has: (key: string) => boolean;
}

class Transformer {
  private definition: TransfigTransformerDefinition;
  private options: TransfigTransformerOptions;

  constructor(
    definition: TransfigTransformerDefinition,
    options: TransfigTransformerOptions = {}
  ) {
    this.definition = definition;
    this.options = options;
  }

  public transform(
    input: any,
    options: TransfigTransformerOptions = this.options
  ) {
    let result = {};
    Object.keys(this.definition).forEach(key => {
      const field = this.definition[key];
      if (typeof field === 'string') {
        if (lives(() => input[field])) {
          result[key] = lives.get(() => input[field]);
        }
      } else if (typeof field === 'function') {
        result[key] = field(this.createContext(input));
      }
    });
    if (options.inclusive) {
      result = { ...input, ...result };
    }
    return result;
  }

  private createContext(input: any): TransfigTransformerContext {
    return {
      has(key: string) {
        return lives(() => input[key]);
      },
      get(key: string) {
        return lives.get(() => input[key]);
      }
    };
  }
}

export default Transformer;
