type Task<T> = {
    label: string;
    run: () => Promise<T>;
    resolve: (value: T) => void;
    reject: (reason?: unknown) => void;
  };
  
  const taskQueue: Task<unknown>[] = [];
  const INTERVAL_MS = 7000;
  
  function startQueueProcessor() {
    setInterval(() => {
      void (async () => {
        if (taskQueue.length === 0) return;
  
        const task = taskQueue.shift();
        if (!task) return;
  
        try {
          const result = await task.run();
          console.log(`[Queue] ✅ Task completed: ${task.label}`);
          task.resolve(result);
        } catch (err) {
          console.error(`[Queue] ❌ Task failed: ${task.label}`, err);
          task.reject(err);
        }
      })();
    }, INTERVAL_MS);
  }
  
  let started = false;
  
  export function enqueueRequest<T>(run: () => Promise<T>, label = 'anonymous task'): Promise<T> {
    if (!started) {
      startQueueProcessor();
      started = true;
    }
  
    console.log(`[Queue] ⏳ Enqueuing task: ${label}`);
  
    return new Promise<T>((resolve, reject) => {
      const task: Task<T> = { label, run, resolve, reject };
      taskQueue.push(task as Task<unknown>);
    });
  }
  