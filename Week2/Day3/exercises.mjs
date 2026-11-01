// TUẦN 2 — NGÀY 3 (NGÀY 10): EVENT LOOP, MICROTASK VÀ TIMER.
// Chủ đề -> docs/video -> làm trong hàm. Không có bảng output phải điền vào MD.
// Các marker events giúp quan sát thứ tự chạy trong chính bài thực hành.
// Dùng Node hiện tại và .mjs; không dùng process.nextTick hoặc setImmediate trong bài.
// Không suy thứ tự timer/I/O hoặc các phase Node từ những ví dụ browser.
// Không busy wait, không tạo vòng microtask vô hạn; input và callback hợp lệ theo đề.
//
// Mục tiêu: giải thích vì sao callback không chạy ngay, await nhường quyền ở đâu,
// và dùng microtask để gom cập nhật mà không tạo một callback cho mỗi add.
// Gợi ý 5 giờ: 60 phút docs/video; 45 phút bài 1; 45 phút bài 2;
// 45 phút bài 3; 75 phút bài 4; 30 phút chạy check, sửa lỗi và tự giải thích.
// WHY: thứ tự xử lý ảnh hưởng dữ liệu caller nhìn thấy.
// HOW: phân biệt phần đồng bộ, callback Promise/queueMicrotask, timer.
// TRADE-OFF: microtask chạy sớm nhưng công việc nặng hoặc xếp lặp vô hạn sẽ chặn việc khác.
// WHEN: gom cập nhật ngắn sau lượt gọi hiện tại; không dùng để chạy CPU nặng song song.
//
// Docs:
// https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide
// https://nodejs.org/api/globals.html#queuemicrotaskcallback
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await
// Video:
// Lydia Hallie — Event Loop: https://www.youtube.com/watch?v=eiC58R16hb8
// Philip Roberts — Call stack/event loop: https://www.youtube.com/watch?v=8aGhZQkoFbQ
// Ôn đầu vào tiếng Việt: https://www.youtube.com/watch?v=QJmNEqy0zV0
// Video browser dùng để hiểu mô hình; các API/phase riêng của Node học sau.
//
// Chạy từng bài: node Week2/Day3/check.mjs 1  (đổi 1–4).
// Chạy cả ngày: node Week2/Day3/check.mjs
// Review: đã sửa tên cờ batcher, dọn TODO và sửa cách dùng Promise.resolve ở bài 3.

// BÀI 1 — Tạo lịch chạy thật, không hardcode array kết quả.
// traceQueues(events=[]) trả Promise<array snapshot> sau callback timer.
// Trong phần đồng bộ: push 'sync:start', đăng ký các việc bên dưới, push 'sync:end'.
// Đăng ký đúng thứ tự: Promise.resolve().then -> queueMicrotask -> setTimeout(..., 0).
// Callback tương ứng push 'promise', 'queueMicrotask', 'timer'.
// Timer resolve bằng bản sao events sau khi đã push 'timer'.
// Ngay khi hàm return, events mới có hai marker đồng bộ; callback chưa chạy.
// Kết quả thông thường: ['sync:start','sync:end','promise','queueMicrotask','timer'].
// Không dùng await/timer để giả lập marker microtask và không xóa events có sẵn.
export function traceQueues(events = []) {
  events.push("sync:start");

  const result = new Promise((resolve) => {
    Promise.resolve().then(() => {
      events.push("promise");
    });

    queueMicrotask(() => {
      events.push("queueMicrotask");
    });

    setTimeout(() => {
      events.push("timer");
      resolve([...events]);
    }, 0);
  });

  events.push("sync:end");
  return result;
}

// BÀI 2 — Đẩy công việc đồng bộ sang Promise microtask.
// deferWork(work, events=[]) trả Promise cho kết quả của work().
// Push 'sync:start' và 'sync:end' ngay trong lời gọi hiện tại.
// Dùng Promise.then: callback push 'work' rồi gọi work đúng một lần, không arguments.
// work là function đồng bộ, có thể trả giá trị falsy hoặc throw Error.
// Thành công: fulfill đúng kết quả; lỗi: reject với chính Error đó.
// Events cuối: ['sync:start','sync:end','work'].
// Không chạy work trước rồi mới dùng Promise.resolve để bọc kết quả.
export function deferWork(work, events = []) {
  events.push("sync:start");
  const result = new Promise((resolve, reject) => {
    Promise.resolve().then(() => {
      events.push("work");
      try {
        const value = work();
        resolve(value);
      } catch (err) {
        reject(err);
      }
    });
  });
  events.push("sync:end");
  return result.then((value) => {
    return value;
  });
}

// BÀI 3 — Phần sau await là continuation, không chạy hết đồng bộ.
// Giữ async; push 'before', await Promise.resolve(), push 'after', trả snapshot.
// Không timer, không hardcode output; sửa code đang thiếu điểm await bên dưới.
// Khi caller gọi hàm rồi push 'caller' ngay sau đó, thứ tự phải là:
// ['before', 'caller', 'after'].
// Events mặc định là array riêng, snapshot đã trả không đổi khi events đổi sau đó.
export async function traceAwait(events = []) {
  events.push("before");
  // Promise.resolve(fn) không gọi fn; caller tự thêm marker trong bộ kiểm tra.
  await Promise.resolve();
  events.push("after");
  return [...events];
}

// BÀI 4 — Ứng dụng: gộp nhiều add trước lần flush thành một batch.
// createMicrotaskBatcher(onBatch) trả object { add(value) } dùng closure.
// value là string. add trả undefined; giữ đúng thứ tự và cả giá trị trùng.
// add chưa gọi onBatch ngay; chỉ xếp MỘT queueMicrotask nếu chưa có flush chờ.
// Callback microtask lấy snapshot các value đang chờ, xóa hàng chờ/flag,
// rồi gọi onBatch(snapshot) một lần. onBatch đồng bộ, không throw, không gọi lại add.
// Sau flush, các lần add mới cần tạo batch mới; snapshot cũ không bị đổi.
// Tạo batcher mà chưa add thì không tự gọi onBatch.
// Hai batcher độc lập; method tách ra vẫn hoạt động, không dùng this/global state.
// Ví dụ add('a'); add('b'); -> sau microtask onBatch(['a','b']) đúng một lần.
// Dùng queueMicrotask, không thay bằng timer hoặc gọi callback ngay.
export function createMicrotaskBatcher(onBatch) {
  const pendingValues = [];
  let isScheduled = false;
  return {
    add(value) {
      pendingValues.push(value);
      if (!isScheduled) {
        isScheduled = true;
        queueMicrotask(() => {
          const batch = [...pendingValues];
          pendingValues.length = 0;
          isScheduled = false;
          onBatch(batch);
        });
      }
    },
  };
}
