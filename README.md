# transfig

Migrations designed for NoSQL

![Rat Goblet](https://raw.githubusercontent.com/thomasraydeniscool/transfig/master/image.jpg)

```typescript
import tf from "transfig";

interface IJob {
    type: string;
    start_date: Date;
}

const JobParser = new tf.Parser({
  mappings: [
    {
      check(job: any): job is IJob {
        typeof job === "object" && job.type === "MASTER";
      },
      map() {
        end_date: "start_date",
        type(): string {
          return "TEMPLATE";
        },
        duration(job: IJob): number {
          return job.start_date.valueOf();
        }
      }
    },
    {
      // If check fails map will not be applied
      check(job: any): boolean {
        return false;
      },
      map() {
        type(): string {
          return "";
        }
      }
    }
  ]
});

const raw = {
  type: "MASTER",
  start_date: new Date()
};

const job = JobParser.parse(raw);
/**
 * {
 *   type: "TEMPLATE",
 *   end_date: new Date(),
 *   duration: 1234567910,
 *   start_date: new Date()
 * }
 */
```
