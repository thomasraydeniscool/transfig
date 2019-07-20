import lives from 'lives';

import Migration from './migration';

export interface TransfigMigratorExecuteArgs {
  migrations: string[];
  action: 'up' | 'down';
}

class Migrator {
  private migrations: Migration[];

  constructor(migrations: Migration[]) {
    this.migrations = migrations;
  }

  public is(document: any, target: string) {
    const migration = this.find(target);
    if (migration) {
      const definition = migration.definition;
      const key = lives.or(() => definition.up.key, '__version__');
      return lives(() => document[key] === target);
    } else {
      return false;
    }
  }
  public up(document: any, target?: string) {}
  public down(document: any, target?: string) {}
  public execute(document: any, args: TransfigMigratorExecuteArgs) {}
  public exec = this.execute;

  public find(target: string) {
    let migration;
    migration = this.migrations.find(m =>
      lives(() => m.definition.name === target)
    );
    if (!migration) {
      migration = this.migrations.find(m =>
        lives(() => m.definition.up.target === target)
      );
    }
    return migration;
  }
}

export default Migrator;
