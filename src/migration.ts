import Schema from './schema';
import Transformer from './transformer';

export interface TransfigMigrationDefinition {
  name: string;
  up: TransfigMigrationAction;
  down: TransfigMigrationAction;
}

export interface TransfigMigrationAction {
  target: string | null;
  key?: string;
  schema?: Schema;
  transformer?: Transformer;
  action?: (context: TransfigMigrationActionContext) => any;
}

export interface TransfigMigrationActionContext {
  transformer: Transformer;
  schema: Schema;
}

class Migration {
  private _definition: TransfigMigrationDefinition;

  constructor(definition: TransfigMigrationDefinition) {
    this._definition = definition;
  }

  public get definition() {
    return this._definition;
  }
}

export default Migration;
