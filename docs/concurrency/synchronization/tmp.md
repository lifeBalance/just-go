# “Building our own read-preferred readers–writer mutex”

This material may be protected by copyright.
“Now that we have seen how to use readers–writer mutexes, it would be good to see how they work internally. In this section, we’ll try to build our own readers–writer mutex similar to the one bundled in Go’s sync package. To keep things simple, we will build only the four important functions: ReadLock(), ReadUnlock(), WriteLock(), and WriteUnlock(). We named them slightly differently from the sync versions so that we can distinguish our implementations from the ones in Go’s libraries.
To implement our readers–writer mutex, we need a system that, when a goroutine calls ReadLock(), blocks any access to the write part while allowing other goroutines to still call ReadLock() without blocking. We’ll block the write part by making sure that a goroutine calling WriteLock() suspends execution. Only when all the read goroutines call ReadUnlock() will we allow another goroutine to unblock from WriteLock().
To help us visualize this system, we can think of goroutines as entities trying to access a room with two entrances. This room signifies access to a shared resource. The reader goroutines use a specific entrance, and the writers use another. Entrances only admit one goroutine at a time, although multiple goroutines can“be in the room at the same time. We keep a counter that a reader goroutine increments by 1 when it enters via”
“the reader’s entrance and reduces by 1 when it leaves the room. The writer’s entrance can be locked from the inside using what we call a global lock.”

“The procedure is that when the first reader goroutine enters the room, it must lock the writers’ entrance, as depicted on the right side of figure 4.9. This ensures that a writer goroutine will find access impassable, blocking the goroutine’s execution. However, other reader goroutines will still have access through their own entrance. The reader goroutine knows that it’s the first one in the room because the counter has a value of 1.
The writer’s entrance here is just another mutex lock that we call the global lock. A writer needs to acquire this mutex in order to hold the writer’s part of the readers-writer lock. When the first reader locks this mutex, it blocks any goroutine requesting the writer’s part of the lock.
We need to make sure that only one goroutine is using the readers’ entrance at any time because we don’t want two simultaneous read “outines to enter at the same time and believe they are both the first in the room. This would result in both trying to lock the global lock and only one succeeding. Thus, to synchronize access so only one goroutine can use the readers’ entrance at any time, we can make use of another mutex. In the following listing, we’ll call this mutex readersLock. The readers’ counter is represented by the readersCounter variable, and we’ll call the writer’s lock globalLock.

```go
package listing

import "sync"

type ReadWriteMutex struct {
    readersCounter int           //❶

    readersLock    sync.Mutex    //❷

    globalLock     sync.Mutex    //❸
}
```

❶ Integer variable to count the number of reader goroutines currently in the critical section
❷ Mutex for synchronizing readers access
❸ Mutex for blocking any writers access

The following listing shows an implementation of the locking mechanism we’ve outlined. On the readers side, the ReadLock() function synchronizes access, using the readersLock mutex, to ensure that only one goroutine at a time is using the function.

```go
func (rw *ReadWriteMutex) ReadLock() {
    rw.readersLock.Lock()               //❶
    rw.readersCounter++              //❷
    if rw.readersCounter == 1 {
        rw.globalLock.Lock()         // ❸
    }
    rw.readersLock.Unlock()             //❹
}

func (rw *ReadWriteMutex) WriteLock() {
    rw.globalLock.Lock()                //❺
}
```

❶ Synchronizes access so that only one goroutine is allowed at any time
❷ Reader goroutine increments readersCounter by 1
❸ If a reader goroutine is the first one in, it attempts to lock globalLock.
❹ Synchronizes access so that only one goroutine is allowed at any time
❺ Any writer access requires a lock on globalLock.”

“Once the caller gets hold of the readersLock, it increments the readers’ counter by 1, signifying that another goroutine is about to have read access to the shared resource. If the goroutine realizes that it’s the first one to get read access, it tries to lock the globalLock so that it blocks access to any write goroutines. (The globalLock is used by the WriteLock() function when it needs to obtain the writer’s side of this mutex.) If the globalLock is free, it means that no writer is currently executing its critical section. In this case, the first reader obtains the globalLock, releases the readersLock, and goes ahead to execute its reader’s critical section.
When a reader goroutine finishes executing its critical section, we can think of it as exiting through the same passageway. On its way out, it decreases the counter by 1. Using the same passageway simply means that it needs to get hold of the readersLock when updating the counter.”

“The last one out of the room (when the counter is 0), unlocks the global lock so that a writer goroutine can finally access the shared resource.”
“While a writer goroutine is executing its critical section, accessing the room in our analogy, it holds a lock on the globalLock. This has two effects. First, it blocks other writers’ goroutines since writers need to acquire this lock before gaining access. Second, it also blocks the first reader goroutine when it tries to acquire the globalLock. The first reader goroutine will block and wait until the globalLock becomes available. Since the first reader goroutine also holds the readersLock, it will also block access to any other reader goroutine that follows while it waits. This is akin to the first reader goroutine not moving and thus blocking the readers’ entrance, not letting any other goroutines in.”

“Once the writer goroutine has finished executing its critical section, it releases the globalLock. This has the effect of unblocking the first reader goroutine and later allowing in any other blocked readers.

We can implement this releasing logic in our two unlocking functions. The next code shows both the ReadUnlock() and WriteUnlock() functions. ReadUnlock() again uses the readersLock to ensure that only one goroutine is executing this function at a time, protecting the shared readersCounter variable. Once the reader acquires the lock, it decrements the readersCounter count by 1, and if the count reaches 0, it also releases the globalLock. This allows the possibility of a writer gaining access. On the writer’s side, WriteUnlock() simply releases the globalLock, giving either readers or a single writer access.”

```go
func (rw *ReadWriteMutex) ReadUnlock() {
    rw.readersLock.Lock()                  //❶
    rw.readersCounter--                    //❷
    if rw.readersCounter == 0 {
        rw.globalLock.Unlock()             //❸
    }
    rw.readersLock.Unlock()                //❹
}

func (rw *ReadWriteMutex) WriteUnlock() {
    rw.globalLock.Unlock()                 //❺
}
```
❶ Synchronizes access so that only one goroutine is allowed at any time
❷ The reader goroutine decrements readersCounter by 1.
❸ If the reader goroutine is the last one out, it unlocks the global lock.
❹ Synchronizes access so that only one goroutine is allowed at any time
❺ The writer goroutine, finishing its critical section, releases the global lock.

“Note This implementation of the readers–writer lock is read-preferring. This means that if we have a consistent number of readers’ goroutines hogging the read part of the mutex, a writer goroutine would be unable to acquire the mutex. In technical terms, we say that the reader goroutines are starving the writer ones, not allowing them access to the shared resource. In the next chapter, we will improve this when we discuss condition variables.”
