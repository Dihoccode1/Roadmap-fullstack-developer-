# Roadmap cá nhân: Backend-heavy Fullstack — 01/11/2026 đến 01/05/2027

Mục tiêu: ứng tuyển Internship/Fresher tại công ty Product ở Việt Nam từ tháng 5/2027; có thể giải thích và tự xây một ứng dụng Next.js + NestJS có kiểm thử và triển khai. System Design hướng đến Level 2. Đây là kế hoạch học tập đề xuất dựa trên tự đánh giá, chưa phải kết luận từ phỏng vấn hoặc review code.

**Ưu tiên: 70% backend và nền tảng liên quan, 30% frontend; Hybrid; tài nguyên miễn phí; dự án E-commerce.** Trong sáu tháng, mục tiêu là một portfolio có bằng chứng kỹ thuật và nền tảng đủ để ứng tuyển. Kinh nghiệm vận hành production quy mô lớn cần tiếp tục tích lũy sau đó.

## 1. Skill Assessment

| Nhóm | Đánh giá từ khảo sát | Hướng xử lý |
|---|---|---|
| Strong — tương đối trong hồ sơ hiện tại | Function/Arrow Function, Object/Array tự chấm 4; class/this, cú pháp JS, DSA và Big O phần lớn 3 | Kiểm tra bằng bài thực hành; không dành nhiều tuần học lại cú pháp và LeetCode |
| Medium | HTML/CSS responsive, Tailwind; React component/props/state; Node modules, fs, env; SQL/JOIN cơ bản; Git; cách chia lớp MVC | Dùng ngay trong mini project; bổ sung phần giải thích và lỗi thực tế |
| Weak | Closure, execution context, lexical environment, prototype, async; React render/effect; Node I/O và CPU; API integration; thiết kế DB; architecture; Docker | Ưu tiên trước các chức năng có nhiều trạng thái và nhiều request |
| Missing | TypeScript, NestJS, Next.js, Prisma, Redis, testing; transaction/index; security thực hành; CI/CD, Linux/networking, deployment; System Design và queue | Học theo phụ thuộc và đưa từng phần vào sản phẩm |

Hai điểm cần kiểm chứng: bạn từng nói có To-do DB và backend MVC nhưng phần project experience lại ghi chưa có project. Kế hoạch coi đó là bài tập/kinh nghiệm rời rạc, chưa tính là portfolio hoàn chỉnh. React có nhiều mục mức 3 nhưng chưa có ứng dụng hoàn chỉnh; vì vậy cần xác nhận khả năng tự xây, debug và giải thích thay vì bỏ qua React.

Tự chấm một số cú pháp ở mức 4 không đồng nghĩa JavaScript Core đã vững khi bất đồng bộ và execution model đang ở mức 1. Đây là lỗ hổng quan trọng nhất ở đầu lộ trình.

## 2. Knowledge Gaps cần xử lý

| Lỗ hổng | Vì sao ảnh hưởng mục tiêu | Bằng chứng cần tạo |
|---|---|---|
| Async JS, closure, reference | Khó debug API call, state cũ, xử lý đồng thời và lỗi Promise | Dự đoán output, sửa lỗi async và giải thích stack/queue |
| TypeScript từ 0 | Khó đọc Next/Nest, DTO, thư viện generic; dễ nhầm type với validation | Project strict, kiểm tra input runtime, giải thích type erasure |
| React rendering/effect | Khó hiểu client boundary, data fetching và đồng bộ UI | Sửa stale closure, effect cleanup, kiểm tra bằng DevTools |
| SQL constraint/index/transaction | CRUD đúng chưa đủ để bảo vệ tiền và tồn kho | ERD, SQL, query plan, kiểm thử đặt hàng cạnh tranh |
| Auth và security từ 0 | Có thể lọt quyền, lộ token hoặc chấp nhận dữ liệu không tin cậy | Test 401/403, ownership, rotation/revocation, kiểm tra giá ở server |
| Chưa có vòng đời sản phẩm | Dễ dừng ở tutorial, không biết tái tạo môi trường và xử lý lỗi | README, migration, test, deploy, log, backup/restore |
| System Design từ 0 | Dễ kể tên công nghệ mà thiếu lập luận | Sơ đồ, ước tính tải, failure scenarios và trade-off |

## 3. Dependency Map

```text
JS values/scope/closure → Promise/event loop → TypeScript
                                            ├→ Node HTTP/error/I/O
                                            │   └→ REST API nhỏ + PostgreSQL/SQL
                                            │       └→ Nest module/DI → Prisma/migration
                                            │           └→ Auth/permission → order/transaction
                                            │               └→ Redis → integration tests
                                            └→ React render/effect + HTML/a11y
                                                └→ Next App Router/RSC/rendering
                                                    └→ state/data fetching → tích hợp Nest

Ứng dụng tích hợp → kiểm thử đầy đủ → Docker/Linux/networking
                 → deploy/CI/CD/backup/observability
                 → đo bottleneck → System Design → queue lab
```

SQL nền tảng được học trước Prisma; đây là nhánh phụ thuộc cần thiết để bạn hiểu ORM đang làm gì. Kiểm tra lỗi và test nhỏ bắt đầu sớm, sau đó mới dành tuần riêng cho chiến lược testing. System Design dùng lại các vấn đề bạn đã gặp trong project.

## 4. Quỹ thời gian và nhịp học

- Thứ Hai–Thứ Bảy: 6 × 5 giờ = 30 giờ; Chủ nhật: 7 giờ. Tổng **37 giờ/tuần**.
- 26 tuần: **962 giờ khả dụng**, gồm **780 giờ học có kế hoạch** và **182 giờ dự phòng** (30 + 7 giờ mỗi tuần).
- Tuần được tính từ **Chủ nhật đến Thứ Bảy** để bắt đầu đúng 01/11/2026. Tuần cuối kết thúc 01/05/2027.
- Không đưa lịch đại học vào bảng. Khoảng dự phòng dành cho thi cử phát sinh, kiến thức cần học lại, nghỉ và sửa lỗi; không coi đó là phần phải lấp đầy.
- Tỷ lệ 70/30 tính trên cả lộ trình. Các tuần JS/SQL/production có kiến thức dùng chung; không ép mỗi ngày phải học cả Next lẫn Nest.

| Ngày | 30 giờ học chính/tuần được phân bổ như sau |
|---|---|
| Mỗi ngày Thứ Hai–Thứ Bảy | 45 phút tài liệu; 2 giờ tự code; 45 phút bài tập/test/debug; 30 phút ghi nhớ và đọc thuật ngữ tiếng Anh. Còn 1 giờ dự phòng |
| Chủ nhật | 1 giờ tự kiểm tra tuần trước; 3 giờ project; 1 giờ giải thích/phỏng vấn; 1 giờ lập kế hoạch tuần. Còn 1 giờ dự phòng. Chủ nhật đầu tiên thay review bằng bài đầu vào |

Giữ LeetCode khoảng 2 bài Easy/Medium mỗi tuần trong các phiên bài tập, không cộng ngoài 37 giờ. Từ tuần 23 tăng luyện nói và giải thích lời giải. Nếu một bài tốn quá 45–60 phút, xem gợi ý rồi tự viết lại và giải thích độ phức tạp.

Mỗi chủ đề ghi bốn dòng: **WHY** giải quyết vấn đề gì; **HOW** cơ chế hoạt động; **TRADE-OFF** chi phí/hạn chế; **WHEN** tình huống phù hợp. Mỗi tuần chọn ít nhất một quyết định trong project để viết theo mẫu này.

## 5. Portfolio và phạm vi sản phẩm

| Project | Thời điểm | Phạm vi và bằng chứng |
|---|---|---|
| P1 — Task Management API | Tuần 5–6; hoàn thiện tài liệu/test về sau | Node + TypeScript + PostgreSQL; CRUD, validation, filter/pagination, error handling; ERD, SQL, README, test. Có thể gắn UI nhỏ ở tuần 7–8 |
| P2 — ShopCore MVP | Tuần 9–16 | Next + Nest + Prisma + PostgreSQL; catalog, cart, auth, customer/admin, order; demo luồng mua hàng bằng COD hoặc thanh toán giả lập |
| P3 — ShopCore bản củng cố cho triển khai | Nâng cấp P2, tuần 17–22 | Redis, test, Docker, CI/CD, HTTPS, log/metrics, health check, backup/restore, bằng chứng xử lý tồn kho cạnh tranh |
| P4 — Notification & System Design Lab | Tuần 23–24 | Hai bài thiết kế + một worker RabbitMQ nhỏ, retry/DLQ, idempotency, đo hành vi khi worker chết |

**P2 và P3 là một sản phẩm ở hai mốc phát triển, không tính thành hai project độc lập trên CV.** Portfolio cuối gồm hai project code chính P1 và ShopCore; P4 là project thứ ba nếu hoàn tất. Mỗi project chính cần README chạy lại được, ảnh/video demo, quyết định kiến trúc và test có ý nghĩa.

ShopCore chỉ gồm một cửa hàng, một loại tiền, customer/admin, sản phẩm, danh mục, giỏ hàng, đơn hàng và tồn kho. Lưu tiền bằng đơn vị nguyên nhỏ nhất; server tính tổng tiền từ dữ liệu tin cậy. Order lưu snapshot tên/giá sản phẩm. Chưa đưa multi-vendor, Kubernetes, thanh toán tiền thật, recommendation hoặc chat realtime vào phạm vi sáu tháng.

Kiến trúc đích ban đầu:

```text
Browser ─ HTTPS ─ Reverse proxy
                  ├─ /       → Next.js
                  └─ /api/*  → NestJS modular monolith
                                 ├─ PostgreSQL: dữ liệu nguồn
                                 └─ Redis: cache + rate limit

Next Server Component ─ mạng nội bộ/API URL phía server ─ NestJS public catalog

Lab riêng: Nest/API → outbox → publisher → RabbitMQ → notification worker
```

Quy ước auth cho project: Nest phát access token ngắn hạn, browser giữ access token trong memory; refresh token ở cookie HttpOnly, Secure trên HTTPS, scope theo endpoint auth. Sau reload, gọi refresh có kiểm soát. Catalog công khai có thể render server; trang tài khoản/admin lấy dữ liệu bằng client API đã xác thực ở phiên bản đầu. Đây là lựa chọn giảm độ phức tạp auth SSR; hạn chế là UI riêng tư phải chờ khởi tạo phiên. Nếu sau này cần SSR riêng tư, thiết kế BFF/cookie forwarding riêng và viết test, không truyền token vào HTML.

Nest kiểm tra quyền và ownership trên mọi API cần bảo vệ. Cùng origin qua reverse proxy giúp tích hợp đơn giản hơn, nhưng cookie auth vẫn cần thiết kế CSRF. Không dùng việc ẩn nút hay redirect ở Next làm kiểm tra quyền cuối cùng. Dữ liệu cá nhân không dùng public/shared cache.

## 6. Tổng quan các phase

| Phase | Tuần | Thời gian | Mốc kết thúc |
|---|---|---|---|
| 1. Nền tảng và API đầu tiên | 1–6 | 01/11–12/12/2026 | Giải thích async; dùng TS strict; Task API lưu PostgreSQL |
| 2. React và Next.js | 7–10 | 13/12/2026–09/01/2027 | UI tự xây; hiểu rendering; catalog Next có data states |
| 3. NestJS và Fullstack | 11–16 | 10/01–20/02/2027 | ShopCore mua hàng được; auth/quyền/transaction/cache |
| 4. Testing và production engineering | 17–22 | 21/02–03/04/2027 | Demo triển khai được; CI/CD; backup; số đo và runbook |
| 5. System Design Level 2 | 23–24 | 04/04–17/04/2027 | Hai bài thiết kế + lab queue có lỗi mô phỏng |
| 6. Portfolio và ứng tuyển | 25–26 | 18/04–01/05/2027 | Repo, CV, demo, mock interview; sẵn sàng gửi hồ sơ |

## 7. Roadmap từng tuần

Mỗi tuần dưới đây có bốn phần bắt buộc. KPI là tiêu chí nghiệm thu, không phải cam kết học đủ số giờ là sẽ đạt. Tài liệu R01–R15 nằm ở cuối file; chỉ đọc các mục tương ứng với tuần, không đọc hết một bộ tài liệu.

### Tuần 01 · 01/11–07/11/2026 · JS execution, scope và closure

**Core Topics:** execution context, call stack, lexical scope/environment, hoisting/TDZ; primitive/reference, shallow copy; closure và prototype cơ bản. Ôn `this`, phân biệt arrow với function bằng ví dụ. Tài liệu: R01.

**Milestones / KPI:** dự đoán đúng ít nhất 8/10 đoạn code mới về scope/reference/closure và giải thích được; dùng debugger theo dõi stack; giải thích một lỗi chia sẻ object. Quyết định cần viết: closure giữ private state so với object/class.

**Hands-on Output:** thư mục bài tập JS có 15 đoạn dự đoán output; `createCart()` dùng closure, thêm/xóa/tính tổng theo đơn vị tiền nguyên; sửa lỗi shallow copy; README ghi ba lỗi và cách kiểm chứng.

**Self-Check:**
1. Khi function đã chạy xong, vì sao closure vẫn đọc được biến của nó?
2. Spread object có tách hoàn toàn dữ liệu lồng nhau không? Hãy minh họa.
3. Vì sao `class` không loại bỏ prototype khỏi JavaScript?

### Tuần 02 · 08/11–14/11/2026 · Async JavaScript

**Core Topics:** callbacks, Promise states/chaining, async/await, rejection/try-catch/finally; task/microtask, event loop; `Promise.all`/`allSettled`, tuần tự/song song, timeout và AbortController. Phân biệt ví dụ browser với Node, không suy thứ tự timer/I/O từ một môi trường sang môi trường khác. Tài liệu: R01, R03.

**Milestones / KPI:** giải thích đúng 8/10 bài output mới trong môi trường đã nêu; vẽ luồng synchronous → Promise microtask → timer; sửa missing-await và lỗi nuốt rejection; chứng minh khác biệt thời gian tuần tự/song song trên I/O giả lập.

**Hands-on Output:** mini product loader có loading/success/error, xử lý HTTP lỗi, hủy request cũ; bộ 10 bài async có dự đoán trước khi chạy; bài giới hạn số request đồng thời đơn giản. Quyết định: fail-fast hay thu mọi kết quả.

**Self-Check:**
1. `await` có làm JavaScript thread bị chặn cho đến khi I/O xong không?
2. Khi một Promise trong `Promise.all` reject, các tác vụ khác có tự bị hủy không?
3. Vì sao `try/catch` có thể không bắt được một Promise bị reject mà bạn quên `await`?

### Tuần 03 · 15/11–21/11/2026 · TypeScript nền tảng

**Core Topics:** inference, primitive/object/array/function types, interface/type, union/intersection, optional/readonly, literal types; `unknown`/`any`/`never`, narrowing, type guard, strict null checking, discriminated union. Tài liệu: R02, đọc Basics → Everyday Types → Narrowing.

**Milestones / KPI:** bật `strict`; chuyển cart và product loader sang TS; phân biệt lỗi compile với lỗi runtime bằng ba ví dụ; input ngoài hệ thống đi qua validation trước khi dùng; không dùng `any` để né lỗi trong code tự viết.

**Hands-on Output:** module Product/Cart/OrderDraft, parse dữ liệu `unknown`, trạng thái request dạng union; 10 ví dụ compiler bắt lỗi và hai ví dụ compiler không bảo vệ được runtime. Quyết định: union có discriminator so với nhiều boolean.

**Self-Check:**
1. Vì sao khai báo interface không tự kiểm tra JSON từ API?
2. `unknown` buộc bạn làm gì trước khi truy cập thuộc tính?
3. Khi nào dùng union hữu ích hơn một interface có nhiều trường optional?

### Tuần 04 · 22/11–28/11/2026 · TypeScript áp dụng và workflow

**Core Topics:** generic có constraint; `keyof`/`typeof`, indexed access, Partial/Pick/Omit/Record; enum so với literal union; mapped/conditional types ở mức đọc và ví dụ nhỏ; class/interface/DI bằng tay; decorator ở mức khái niệm và đối chiếu compiler config của framework khi đến Nest. npm scripts, lint/format, branch/PR. Tài liệu: R02.

**Milestones / KPI:** tạo một generic có nhu cầu thật; giải thích utility type thay vì chép; typecheck và lint chạy từ scripts; mở PR cho chính mình với mô tả và checklist review. Không coi PR tự review là kinh nghiệm team.

**Hands-on Output:** thư viện nhỏ `Result`, `PaginatedResponse`, bộ lọc sản phẩm typed; một service nhận repository qua constructor để thay implementation; README hướng dẫn setup. Quyết định: interface nhỏ theo nhu cầu so với abstraction tổng quát sớm.

**Self-Check:**
1. Generic giữ mối quan hệ giữa input và output thế nào?
2. `Partial<Product>` có đủ để làm runtime DTO cho API cập nhật không?
3. Inject dependency giúp thay repository khi test như thế nào?

### Tuần 05 · 29/11–05/12/2026 · Node.js và Task API phiên bản 1

**Core Topics:** Node runtime, HTTP request/response, method/status/header/body; non-blocking I/O/libuv, CPU-bound/I/O-bound; fs async, env và error boundary; Buffer/stream/backpressure cơ bản; worker/child process chỉ thử nghiệm. Dùng `node:http` cho API nhỏ để quan sát nền tảng. Tài liệu: R03.

**Milestones / KPI:** tự xây CRUD task không nhìn tutorial; xử lý input sai, JSON sai, route không tồn tại; giải thích một vòng CPU lớn làm request khác chậm; chứng minh đọc file streaming tránh gom toàn bộ file vào một buffer.

**Hands-on Output:** P1 v1: create/list/get/update/delete, filter trạng thái, pagination có giới hạn; lưu memory rồi snapshot file để học I/O, ghi rõ hạn chế concurrent writes; smoke checks tái chạy được. Quyết định: stream so với read-all.

**Self-Check:**
1. Node xử lý nhiều kết nối thế nào khi JavaScript thường chạy trên một thread?
2. `async` có tự đưa phép tính CPU nặng sang worker không?
3. Vì sao lưu JSON file dễ lỗi khi có nhiều request ghi cùng lúc?

### Tuần 06 · 06/12–12/12/2026 · PostgreSQL và Task API phiên bản 2

**Core Topics:** table/key/constraint, NOT NULL/UNIQUE/FK/CHECK; SQL CRUD, JOIN/GROUP BY, subquery/CTE cơ bản; parameterized queries, connection pool; BEGIN/COMMIT/ROLLBACK, ACID; index nhập môn. Dùng driver PostgreSQL trực tiếp trước ORM. Tài liệu: R04. Có thể chạy DB bằng một container theo hướng dẫn, phần Docker chuyên sâu ở tuần 19.

**Milestones / KPI:** viết ít nhất 10 query theo yêu cầu nghiệp vụ; dữ liệu còn sau restart; mô phỏng rollback của thao tác hai bước; sort/filter chỉ nhận trường được cho phép; ghi nhận hai request cạnh tranh đơn giản.

**Hands-on Output:** P1 v2 lưu PostgreSQL; ERD Task/Tag/TaskTag hoặc cấu trúc tối thiểu tương đương; schema/seed SQL chạy lại được; request collection, README, kiểm tra CRUD và lỗi. Quyết định: dữ liệu quan hệ so với nhúng mọi thứ vào JSON.

**Self-Check:**
1. FK bảo vệ điều gì mà kiểm tra trong code có thể bỏ sót khi concurrent requests?
2. Tại sao parameterized query giúp xử lý input an toàn hơn nối chuỗi SQL?
3. Transaction giải quyết được gì và vì sao vẫn phải quan tâm isolation?

**Gate 1:** tự xây lại một endpoint bằng TS, giải thích async, viết JOIN và chứng minh rollback. Nếu chưa đạt, dùng dự phòng để sửa trước khi tăng phạm vi.

### Tuần 07 · 13/12–19/12/2026 · React rendering và state

**Core Topics:** render/commit, props/state snapshot, state update batching, immutable updates; keys/reconciliation, composition, controlled form; HTML semantic, label, keyboard/focus. React + TS + Tailwind, chỉ ôn CSS cần dùng. Tài liệu: R05.

**Milestones / KPI:** giải thích ba nguyên nhân render thường gặp, dùng DevTools kiểm chứng; sửa lỗi dùng index key khi danh sách thay đổi; giao diện hoạt động ở 360px và 1280px, form dùng được bằng keyboard.

**Hands-on Output:** Task Dashboard có form, edit, filter, empty state; thêm reducer nếu state thực sự phức tạp. Quyết định: derived state so với lưu bản sao trong state.

**Self-Check:**
1. Re-render có luôn dẫn đến thay đổi DOM không?
2. Vì sao mutation trực tiếp state có thể gây UI sai?
3. Key ảnh hưởng việc React giữ state của một item thế nào?

### Tuần 08 · 20/12–26/12/2026 · Effect, API integration và React hoàn chỉnh

**Core Topics:** useEffect dependency/cleanup, stale closure, request race/cancellation; useRef, custom hook, Context; useMemo/useCallback theo vấn đề đo được; Fetch, HTTP lỗi, loading/empty/error/retry. Tài liệu: R05, R01.

**Milestones / KPI:** nối dashboard vào P1; có loading/error/empty/success; thao tác nhanh không để response cũ ghi đè mới; tự tái tạo và sửa một effect loop; phân biệt side effect với tính toán trong render.

**Hands-on Output:** React Task Dashboard chạy được với API thật, video demo ngắn, báo cáo một bug stale closure và một bug race condition. Quyết định: local state hay Context; chưa cần đưa mọi state vào global store.

**Self-Check:**
1. Khi nào bạn không cần useEffect dù UI phụ thuộc một state khác?
2. Vì sao callback có thể đọc giá trị state của lần render cũ?
3. Cleanup xử lý gì khi component unmount hoặc dependency thay đổi?

### Tuần 09 · 27/12/2026–02/01/2027 · Next.js App Router và rendering

**Core Topics:** page/layout/nested layout, route group/dynamic route, loading/error/not-found; Server/Client Component, RSC payload/hydration ở mức giải thích; SSR/CSR/SSG/ISR như các cách render/cập nhật; metadata, image/font. Client Component vẫn có thể có HTML được prerender từ server. Tài liệu: R06.

**Milestones / KPI:** tự dựng bốn route shop/home/catalog/detail/admin shell; chỉ đặt client boundary ở phần cần tương tác; giải thích component boundary khác với thời điểm render; build chạy được ngoài dev mode.

**Hands-on Output:** ShopCore UI skeleton có catalog dữ liệu mẫu, dynamic product detail, layout admin, loading/error; một bảng chọn rendering cho catalog, detail, cart và admin. Quyết định: SEO/public content so với UI riêng tư tương tác.

**Self-Check:**
1. Server Component có đồng nghĩa mọi dữ liệu luôn mới ở mỗi request không?
2. `'use client'` thay đổi boundary nào, và vì sao không đồng nghĩa chỉ render ở browser?
3. SSR, SSG, ISR khác nhau ở thời điểm tạo/cập nhật nội dung như thế nào?

### Tuần 10 · 03/01–09/01/2027 · Next data, caching và state

**Core Topics:** server Fetch, streaming/loading, Route Handler, Server Action qua lab nhỏ; cache/revalidation theo phiên bản và cấu hình đã chọn; TanStack Query keys/staleness/invalidation; Zustand cho client state nhỏ. Tách server state, URL state và local UI state. Tài liệu: R06, R08.

**Milestones / KPI:** chứng minh bằng log/network khi nào dữ liệu được lấy lại; filter catalog biểu diễn được trên URL; mutation cập nhật UI đúng; private state không bị dùng chung cache. Khóa version/lockfile và ghi rõ cache mode đã dùng, không trộn hướng dẫn từ các major khác nhau.

**Hands-on Output:** catalog/search/detail với API mẫu hoặc mock thay được; Zustand giữ cart draft/UI preference; TanStack Query quản lý một danh sách tương tác; lab Server Action và Route Handler tách biệt. Quyết định: server fetch so với client query theo từng màn hình, tránh fetch cùng dữ liệu ở hai nơi không có chủ đích.

**Self-Check:**
1. Cache của Next server, TanStack Query và Redis khác nhau ở đâu?
2. Sau sửa sản phẩm, những dữ liệu/view nào cần cập nhật hoặc invalidation?
3. Vì sao Server Action vẫn phải kiểm tra input và quyền?

**Gate 2:** demo UI responsive có đủ trạng thái dữ liệu, giải thích rendering, sửa được effect bug và trình bày chiến lược state/cache theo từng màn hình.

### Tuần 11 · 10/01–16/01/2027 · NestJS Core và request lifecycle

**Core Topics:** module/controller/provider/service, DI và custom provider; decorator theo cấu hình của Nest; middleware/guard/interceptor/pipe/filter; DTO, validation, serialization, status/error format; config validation và OpenAPI. Tài liệu: R07.

**Milestones / KPI:** tạo ProductsModule từ đầu; vẽ request lifecycle và gắn log kiểm chứng, gồm chiều response qua interceptor; trả 400 cho input sai, 404 khi không có dữ liệu; không để stack trace hoặc dữ liệu nhạy cảm trong response.

**Hands-on Output:** Nest catalog API dùng repository memory; Swagger/OpenAPI và lỗi chuẩn; test nhỏ cho service tính giá hoặc validation. Quyết định: pipe kiểm tra input, guard kiểm tra truy cập, service giữ business rule.

**Self-Check:**
1. Provider khác gì với việc tự `new` một service trong controller?
2. Vì sao interface TS không thay thế được DTO validation lúc runtime?
3. Bạn đặt logging thời gian request và xử lý lỗi không mong đợi ở đâu?

### Tuần 12 · 17/01–23/01/2027 · Prisma, schema và catalog thật

**Core Topics:** model/relation/cardinality, migration dev/deploy, seed, constraint; transaction API theo Prisma major đã chọn; select/include, pagination, sort allowlist và N+1; index/composite index, EXPLAIN/EXPLAIN ANALYZE. Tài liệu: R04, R09. Không trộn cú pháp Prisma giữa các major.

**Milestones / KPI:** dựng DB trống bằng migrations và seed; Next đọc catalog từ Nest; seed khoảng 10.000 sản phẩm để quan sát query; so sánh query plan trước/sau một index trên cùng dataset, không ép planner phải chọn index khi scan hợp lý hơn.

**Hands-on Output:** ERD User/Product/Category/Cart/CartItem/Order/OrderItem/AuthSession; Nest Products/Categories dùng Prisma; script seed; báo cáo query và một ví dụ tránh N+1. Chỉ triển khai các module cần trong tuần, các bảng sau được thêm dần qua migration.

**Self-Check:**
1. Vì sao dùng ORM vẫn cần hiểu SQL và query plan?
2. Khi nào composite index phù hợp với filter/sort của bạn, và chi phí ghi là gì?
3. EXPLAIN ANALYZE khác EXPLAIN thế nào, đặc biệt với câu lệnh thay đổi dữ liệu?

### Tuần 13 · 24/01–30/01/2027 · Authentication cơ bản và password security

**Core Topics:** authentication/authorization, session so với JWT; password hashing dùng thư viện argon2 hoặc bcrypt, salt và cost; register/login, access-token signing/verification/expiry; config secrets, request validation, chống lộ user fields. Tài liệu: R07, R14.

**Milestones / KPI:** register/login chạy với DB thật; không lưu/log plaintext password; response không có password hash; từ chối token sai chữ ký/hết hạn; có kiểm tra trùng tài khoản ở DB; giải thích token ký khác với mã hóa.

**Hands-on Output:** AuthModule/UserModule, access-token guard, endpoint `/me`; unit/service tests cho sai mật khẩu, user trùng và token lỗi; sơ đồ trust boundary. Quyết định: session hay access/refresh cho ứng dụng này; flow refresh hoàn thiện ở tuần kế tiếp.

**Self-Check:**
1. JWT ký có che nội dung payload khỏi người cầm token không?
2. Vì sao hash password khác với mã hóa có thể giải mã?
3. Những thông tin nào không nên đưa vào log và token payload?

### Tuần 14 · 31/01–06/02/2027 · Refresh token, RBAC và tích hợp đăng nhập

**Core Topics:** refresh token rotation, hash refresh token trong DB, session family/revocation; HttpOnly/Secure/SameSite/path; CSRF/origin controls, CORS khi khác origin; RBAC + permission đơn giản + resource ownership; client refresh single-flight và giới hạn retry. Tài liệu: R07, R14.

**Milestones / KPI:** login → protected API → access expiry → refresh → logout hoạt động; test 401/403, user A không đọc đơn user B; token refresh cũ bị từ chối; concurrent refresh cùng phiên được xử lý bằng cập nhật DB nguyên tử và client coordination, không chỉ cờ boolean phía server.

**Hands-on Output:** Next login/logout/admin shell; customer/admin với permission như `product:write`; refresh cookie được cấu hình đúng môi trường; ma trận test token hết hạn, bị sửa, reuse, logout, thiếu quyền; ghi rõ hành vi nhiều tab khi refresh trùng. Quyết định: access token memory giảm lưu trữ lâu dài nhưng cần khôi phục phiên sau reload.

**Self-Check:**
1. Vì sao ẩn nút admin không bảo vệ được API?
2. HttpOnly giúp giảm việc đọc token bằng JS nhưng có tự ngăn mọi XSS/CSRF không?
3. Logout thu hồi refresh token ảnh hưởng thế nào đến access token chưa hết hạn?

### Tuần 15 · 07/02–13/02/2027 · Order, transaction và concurrency

**Core Topics:** cart/order use case, server-side price calculation, tiền dạng số nguyên; order item snapshot; transaction/ACID, isolation, row lock/conditional update, deadlock và bounded retry; idempotency key + unique constraint. Tài liệu: R04, R09.

**Milestones / KPI:** tạo order và trừ tồn kho commit/rollback cùng nhau; 20 request tranh mua 5 đơn vị chỉ có tối đa 5 lần mua thành công; stock không âm; cùng idempotency key tạo tối đa một order và payload khác bị từ chối; client sửa giá không đổi được tổng tiền server.

**Hands-on Output:** checkout COD/giả lập, order history/detail, admin cập nhật trạng thái theo transition hợp lệ; test DB thật cho tranh chấp tồn kho, rollback và duplicate request. Quyết định: conditional update/lock so với đọc rồi ghi; không dùng Redis lock làm nguồn bảo vệ tồn kho duy nhất.

**Self-Check:**
1. Vì sao đặt đoạn read-then-write vào transaction chưa chắc đã tránh overselling?
2. Khi client timeout rồi gửi lại checkout, làm sao tránh hai đơn hàng?
3. Nếu sản phẩm đổi giá sau mua, lịch sử đơn hàng lấy giá từ đâu?

### Tuần 16 · 14/02–20/02/2027 · Redis, state synchronization và chốt MVP

**Core Topics:** String/Hash/List/Set/Sorted Set thử bằng CLI; TTL, cache-aside, invalidation, cache key theo filter/sort/page; hit/miss, penetration/stampede/avalanche; cache catalog, rate limit; TanStack invalidation/optimistic rollback cho cart, Zustand cho UI state. Tài liệu: R08, R10.

**Milestones / KPI:** có cold/warm cache measurement; sửa sản phẩm làm dữ liệu liên quan cập nhật trong giới hạn đã công bố; Redis unavailable không làm public catalog chết do cache; rate limiter có hành vi khi Redis lỗi được mô tả; cart mutation lỗi khôi phục UI đúng. Không lấy cached stock/price làm quyết định checkout cuối cùng.

**Hands-on Output:** ShopCore MVP v1: customer đăng nhập → xem catalog → cart → checkout → history; admin quản lý sản phẩm/đơn; cache catalog và giới hạn auth requests; demo 5–8 phút, issue list. Quyết định: consistency của catalog cache so với tính đúng đắn của checkout.

**Self-Check:**
1. Vì sao TTL không đủ để bảo đảm mọi lần đọc đều thấy dữ liệu mới nhất?
2. Bạn xử lý nhiều request cùng gặp cache miss thế nào ở phạm vi hiện tại?
3. Vì sao rate limit lưu trong memory từng process có thể sai khi scale nhiều instance?

**Gate 3:** demo end-to-end customer/admin; test quyền, refresh, tranh mua và idempotency đều có bằng chứng. Nếu chưa đạt, ưu tiên sửa auth/order trước trang trí giao diện hoặc thêm dịch vụ.

### Tuần 17 · 21/02–27/02/2027 · Backend testing có chiến lược

**Core Topics:** unit/integration/E2E boundaries; Jest, Nest TestingModule, mock dependency theo boundary; Supertest; test PostgreSQL thật, fixtures/seed, isolation và cleanup; test Redis path cần thiết. Tài liệu: R11.

**Milestones / KPI:** ít nhất 15 tình huống nghiệp vụ quan trọng có assertion, gồm auth, ownership, stock, rollback, duplicate và cache invalidation; một lỗi chủ động cài vào phải làm test liên quan fail; hai lần chạy liên tiếp không phụ thuộc thứ tự test. Số lượng là mức tối thiểu, không thay thế chất lượng.

**Hands-on Output:** test suite phân tầng, test matrix yêu cầu → case; scripts riêng unit/integration; DB test tách DB dev; báo cáo phần chưa kiểm thử. Quyết định: mock nhanh cho logic thuần, DB thật cho constraint/transaction; không mock Prisma rồi coi như đã test concurrency.

**Self-Check:**
1. Unit test pass có bảo đảm migration và DB constraint đúng không?
2. Mock quá sâu làm test bỏ sót loại lỗi nào?
3. Bạn cô lập dữ liệu giữa các integration test chạy song song thế nào?

### Tuần 18 · 28/02–06/03/2027 · Frontend testing và E2E toàn luồng

**Core Topics:** React Testing Library theo hành vi người dùng; form accessibility/loading/error; Playwright với browser, API và DB test; selectors bền, auto-wait, trace/screenshot, fixtures. Chỉ chọn Playwright, không học thêm Cypress trong giai đoạn này. Tài liệu: R11.

**Milestones / KPI:** ít nhất 5 user journeys qua browser: login, mua hàng, cart lỗi, admin, chặn truy cập trái phép; component tests cho validation và loading/error; chạy lại không cần sleep cố định; một broken flow làm test fail đúng lý do.

**Hands-on Output:** bộ E2E + trace lỗi; checklist keyboard/form focus/mobile; bước chuẩn bị dữ liệu và chạy test có trong README. Quyết định: test business rule ở tầng thấp và giữ E2E cho các luồng quan trọng.

**Self-Check:**
1. Vì sao kiểm tra text/button theo vai trò thường bền hơn phụ thuộc cấu trúc DOM?
2. E2E nên chứng minh điều gì mà unit test không bao phủ?
3. Khi test flaky, bạn phân biệt lỗi test, dữ liệu và race trong sản phẩm thế nào?

### Tuần 19 · 07/03–13/03/2027 · Docker, Linux và networking

**Core Topics:** Dockerfile, image/container, multi-stage, env/secrets, non-root process; Compose service/network/volume/health; Linux permissions/process/log/SSH; IP/port/DNS/TCP/HTTP/HTTPS; Nginx route đến Next và Nest; không public DB/Redis port ngoài nhu cầu local. Tài liệu: R12.

**Milestones / KPI:** chạy từ clean clone + env mẫu + build/Compose; restart app không mất dữ liệu DB; browser gọi API qua đường dẫn cùng origin; giải thích tên host trong container khác `localhost` trên máy; không bake secrets vào image.

**Hands-on Output:** stack Next/Nest/PostgreSQL/Redis/Nginx, env example, architecture diagram, runbook các lỗi port/DNS/network; đo image trước/sau multi-stage. Quyết định: Compose cho môi trường nhỏ so với chi phí vận hành orchestrator.

**Self-Check:**
1. Vì sao `localhost` từ container Next không trỏ đến container Nest?
2. Volume khác filesystem tạm của container thế nào?
3. Request HTTPS đi qua reverse proxy đến ứng dụng qua các bước nào?

### Tuần 20 · 14/03–20/03/2027 · Deployment, HTTPS và vận hành ban đầu

**Core Topics:** môi trường dev/staging/demo, production build, DNS/TLS, secrets, migration deploy, health/readiness; timeout và trusted proxy; quản lý process/log; ánh xạ AWS EC2/S3/RDS/CloudFront/Route53/LB ở mức kiến trúc. Không triển khai toàn bộ AWS services chỉ để đủ danh sách. Tài liệu: R06 self-hosting, R12, R16.

**Milestones / KPI:** ít nhất một demo public qua HTTPS trên hosting có điều kiện miễn phí phù hợp tại lúc triển khai; test login/cookie/refresh sau deploy; redeploy có migration và smoke check; một thành viên giả lập theo README có thể tái tạo local stack.

**Hands-on Output:** demo URL, deployment/runbook, sơ đồ domain/request flow, danh sách config và bằng chứng release thủ công. Quyết định: PaaS giảm vận hành so với VM cho quyền kiểm soát lớn hơn; nêu rõ demo một instance chưa có HA.

**Self-Check:**
1. Local chạy được nhưng production login mất cookie: bạn kiểm tra những gì?
2. Readiness khác kiểm tra process còn sống ở điểm nào?
3. Bạn xác định lỗi DNS, TLS, proxy, app hay DB dựa trên bằng chứng nào?

Nhánh chi phí: chỉ dùng gói phù hợp hạn mức miễn phí đã kiểm tra ngay lúc deploy. Nếu không có nơi host toàn stack miễn phí, giữ compose stack tái tạo được, public phần frontend/demo phù hợp và ghi video fullstack local; không gọi video local là hệ thống đã deploy public. Đây là phương án dự phòng có giới hạn, chưa đạt KPI public fullstack. AWS lab chỉ thực hành khi tài khoản/gói và quota đáp ứng ngân sách; đọc điều kiện trước khi tạo tài nguyên. Không bắt buộc mua domain riêng.

### Tuần 21 · 21/03–27/03/2027 · CI/CD, migration và backup/restore

**Core Topics:** GitHub Actions trigger/job/cache/service containers/secrets; lint/typecheck/unit/integration/build/image; staging deploy, smoke, release approval nếu cần, rollback; DB backup/restore và migration tương thích ngược. Tài liệu: R13, R04, R12.

**Milestones / KPI:** PR lỗi type hoặc test không qua pipeline; clean runner chạy được DB tests; có ít nhất một release đi qua pipeline đến demo/staging và smoke check; backup khôi phục vào DB mới, đối chiếu dữ liệu; đo thời gian restore. Nếu provider chưa hỗ trợ CD miễn phí, chứng minh CI + manual deployment có tài liệu và ghi rõ CD chưa tự động.

**Hands-on Output:** pipeline, release notes, backup script/runbook, log diễn tập rollback app + restore test. Quyết định: rollback binary khác phục hồi data; dùng migration tương thích thay vì tùy tiện chạy migration ngược trên data thật.

**Self-Check:**
1. Vì sao backup thành công chưa chứng minh khôi phục được?
2. App rollback xong có chắc schema cũ còn tương thích không?
3. Migration và seed nên chạy ở bước nào để tránh nhiều replica cùng thực hiện?

### Tuần 22 · 28/03–03/04/2027 · Observability, performance và chốt ShopCore

**Core Topics:** structured logs/request ID, error redaction; metrics request rate/error rate/duration p50/p95, DB pool và cache hit; health, alert qua ngưỡng thử nghiệm; load test tái tạo được; Node memory/GC và CPU profiling nhập môn; OWASP review theo luồng thực tế. Tài liệu: R03, R04, R14.

**Milestones / KPI:** chạy baseline và sau một tối ưu với cùng dataset/máy/kịch bản, báo cáo p95/error rate/throughput; thử dừng Redis hoặc DB trong lab và ghi phản ứng; phát hiện được lỗi 5xx mô phỏng qua log/metric; không tuyên bố số tải local là năng lực production.

**Hands-on Output:** dashboard local bằng công cụ metrics đơn giản hoặc Prometheus/Grafana nếu còn thời gian; bằng chứng log/query plan; incident note một trang; ShopCore v1.0, README/ERD/API/auth flow và known limitations; rà lại P1 theo checklist tối thiểu.

**Self-Check:**
1. p95 tăng trong khi CPU thấp: bạn điều tra DB, I/O và connection pool thế nào?
2. Cache hit cao có đủ để kết luận hệ thống đúng và nhanh không?
3. Một instance app + một DB còn những điểm lỗi đơn nào?

**Gate 4:** clean setup, critical tests, HTTPS demo hoặc ghi rõ giới hạn hosting, pipeline, log/metrics, backup restore và giải thích concurrency. Đóng băng tính năng flagship sau mốc này; chỉ sửa lỗi ảnh hưởng demo và dữ liệu.

### Tuần 23 · 04/04–10/04/2027 · System Design Level 2

**Core Topics:** yêu cầu chức năng/phi chức năng, giả định tải, QPS/storage/bandwidth ước tính; API/data model; vertical/horizontal scale, LB/reverse proxy/CDN; cache, replication/partition/sharding; HA/fault tolerance, CAP/eventual consistency ở phạm vi có network partition. Chọn bài toán URL Shortener và phân tích lại ShopCore. Kiến thức hạ tầng đối chiếu R04, R10, R12, R16.

**Milestones / KPI:** mỗi bài trong 30–40 phút: làm rõ yêu cầu, tính tải theo giả định, vẽ sơ đồ, API/schema, chỉ ra ít nhất hai bottleneck/failure modes và ba trade-off. Phân biệt dữ liệu đo thật của ShopCore với giả định của bài phỏng vấn.

**Hands-on Output:** hai design docs có diagram Draw.io/Mermaid, bảng giả định và hướng nâng cấp theo ngưỡng; URL Shortener có unique code, redirect/cache, collision/abuse discussion; ShopCore có chiến lược stock consistency và invalidation.

**Self-Check:**
1. Trước khi thêm sharding, bạn kiểm tra những lựa chọn đơn giản nào?
2. Khi mạng bị phân vùng, yêu cầu nhất quán/khả dụng của catalog và checkout khác nhau ra sao?
3. Thêm app replica có tự giải quyết bottleneck database không?

### Tuần 24 · 11/04–17/04/2027 · Notification queue và distributed lab

**Core Topics:** modular monolith so với microservices; RabbitMQ producer/consumer, exchange/queue/routing, ack, publisher confirm, retry hữu hạn/DLQ; at-least-once và idempotency; transactional outbox nhập môn. Kafka topic/partition/consumer group chỉ so sánh khái niệm; gRPC/service discovery/API Gateway ở mức nhận diện. Tài liệu: R15.

**Milestones / KPI:** transaction ghi order + outbox; publisher gửi event và worker tạo notification record/log; message trùng không tạo record trùng nhờ unique event ID; worker chết trước ack có redelivery; retry đến giới hạn chuyển DLQ. Ghi rõ lab không chứng minh exactly-once delivery hoặc email ngoài hệ thống chỉ gửi một lần.

**Hands-on Output:** P4 worker riêng + Compose RabbitMQ + outbox publisher nhỏ; ba kịch bản lỗi có log; design Notification System với queue backlog/consumer scaling; tài liệu ranh giới giao dịch. Nếu backlog project chính còn lớn, chỉ giữ design và demo producer/consumer, đánh dấu outbox/DLQ chưa đạt.

**Self-Check:**
1. Worker xử lý xong rồi chết trước ack sẽ gây tình huống gì?
2. Vì sao ghi DB xong rồi publish message có thể làm mất event nếu thiếu cơ chế bổ sung?
3. Khi nào chi phí microservices vượt lợi ích đối với project của bạn?

**Gate 5:** trình bày được hai bài thiết kế và phân biệt reliability guarantee thực tế của lab. Chỉ mô tả phần đã chạy trên CV.

### Tuần 25 · 18/04–24/04/2027 · Portfolio, CV và mock interview

**Core Topics:** review JS/TS/Node/Nest/SQL/auth theo lỗi đã gặp; README/problem/setup/architecture/trade-off; CV theo bằng chứng; GitHub Flow, PR description, code review; luyện giải thích tiếng Việt và giới thiệu project tiếng Anh ngắn.

**Milestones / KPI:** hai repo chính có hướng dẫn chạy, screenshot, demo/video, env mẫu và không chứa secrets; 2 mock interviews 45 phút; giải thích kiến trúc trong 5 phút và một bug trong 3 phút; chọn 5–10 tin Internship/Fresher thực tế để đối chiếu yêu cầu tại thời điểm đó. Không tự nhận đã có team review khi chưa làm.

**Hands-on Output:** CV một trang bản nháp hoàn chỉnh, GitHub profile/readme, demo script; bảng yêu cầu tuyển dụng → bằng chứng project → thiếu gì; ít nhất một PR được review bằng checklist, ưu tiên nhờ bạn học review nếu có người phù hợp, không phụ thuộc việc tìm được reviewer.

**Self-Check:**
1. Phần nào bạn tự thiết kế, phần nào tham khảo, và bạn chứng minh hiểu code thế nào?
2. Tại sao chọn Nest + PostgreSQL + Redis cho project này?
3. Nếu được thêm hai tuần, bạn sửa bottleneck/rủi ro nào trước và vì sao?

Tuần này cũng là điểm gom phần học bù: dùng thời gian dành cho lab nâng cao trước khi cắt phần portfolio cốt lõi. Không thêm framework mới để làm đẹp CV.

### Tuần 26 · 25/04–01/05/2027 · Nghiệm thu và bắt đầu ứng tuyển

**Core Topics:** phỏng vấn async/closure/type/runtime, React render/Next boundary, Nest DI/lifecycle, SQL/index/transaction, auth/security, Docker/deploy; DSA Easy/Medium kèm giải thích; System Design Level 2; chỉnh CV theo từng vị trí.

**Milestones / KPI:** đạt checklist cuối tài liệu; 2 mock interviews tổng hợp, lập kế hoạch sửa ba điểm yếu nhất; tái chạy demo/tests từ clean setup; CV liên kết đúng repo/demo, không ghi số hiệu năng thiếu bối cảnh; chuẩn bị 5 hồ sơ phù hợp để gửi từ đầu tháng 5. Việc gửi hồ sơ do bạn chủ động thực hiện.

**Hands-on Output:** CV bản ứng tuyển, portfolio hai project chính và lab nếu đạt; bảng theo dõi công ty/vị trí/yêu cầu/ngày gửi/phản hồi; video dự phòng; bản tự đánh giá mới so với tuần 1.

**Self-Check:**
1. Bạn có thể tái tạo và sửa một lỗi trong project khi người phỏng vấn thay đổi yêu cầu không?
2. Bạn giải thích trade-off của ba quyết định quan trọng mà không đọc tài liệu được chưa?
3. Những tính năng nào đã được test/deploy thật và giới hạn hiện tại của hệ thống là gì?

## 8. Tài liệu miễn phí và cách dùng

Các nguồn dưới đây là tài liệu của dự án/đơn vị phát triển, đã đối chiếu ngày 31/10/2026. Phiên bản và điều kiện hosting có thể thay đổi trước tuần bạn sử dụng; đọc tài liệu đúng major và config của project, giữ lockfile và ghi phiên bản vào README. Không cần chạy theo major mới khi project đang ổn định.

| Mã | Tài liệu | Đọc để làm gì |
|---|---|---|
| R01 | [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) | Grammar/types, functions, objects, promises; chạy lại từng ví dụ và sửa input |
| R02 | [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html), [Enums](https://www.typescriptlang.org/docs/handbook/enums.html) | Basics, Everyday Types, Narrowing, Functions, Generics, Type Manipulation, Utility Types |
| R03 | [Node Learn: Event Loop](https://nodejs.org/learn/asynchronous-work/event-loop-timers-and-nexttick) và các mục Learn liên quan | Non-blocking, HTTP, fs, streams, worker, debugging/memory theo nhu cầu từng tuần |
| R04 | [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html), [Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html) | SQL, constraint, transaction, planner; thực hành trên dataset của mình |
| R05 | [React Learn](https://react.dev/learn) | Render/commit, state snapshot, Effects/cleanup, sharing state, refs; tự code bài tập trước khi xem lời giải |
| R06 | [Next Learn](https://nextjs.org/learn), [Server/Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components), [Caching](https://nextjs.org/docs/app/getting-started/caching), [Self-hosting](https://nextjs.org/docs/app/guides/self-hosting) | App Router, render boundary, data/cache theo cấu hình; đọc đúng nhánh khi bật/tắt Cache Components |
| R07 | [Nest First Steps](https://docs.nestjs.com/first-steps), [Authentication](https://docs.nestjs.com/security/authentication), [Authorization](https://docs.nestjs.com/security/authorization) | Module/provider/lifecycle trước; validation và auth sau; API ví dụ phải khớp phiên bản package |
| R08 | [TanStack Query Overview](https://tanstack.com/query/latest/docs/framework/react/overview), [SSR/Hydration](https://tanstack.com/query/latest/docs/framework/react/guides/ssr) | Query keys, mutations/invalidation, stale time; SSR integration chỉ đọc khi có nhu cầu |
| R09 | [Prisma Transactions](https://www.prisma.io/docs/orm/fundamentals/transactions) và các mục schema/migration/query trong docs cùng major | ORM, schema, migration và tính nguyên tử; đối chiếu SQL, không học thuộc một API từ video khác major |
| R10 | [Develop with Redis](https://redis.io/docs/latest/develop/) | Data types/commands, TTL, cache use cases; thử CLI trước khi bọc abstraction |
| R11 | [Nest Testing](https://docs.nestjs.com/fundamentals/testing), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/), [Playwright](https://playwright.dev/docs/intro) | Unit/integration/API E2E/component/browser test theo đúng boundary |
| R12 | [Docker Get Started](https://docs.docker.com/get-started/), [Ubuntu Command Line](https://ubuntu.com/tutorials/command-line-for-beginners), [Nginx Reverse Proxy](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/), [MDN HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview) | Dựng môi trường, shell/network troubleshooting, proxy HTTP |
| R13 | [GitHub Actions Quickstart](https://docs.github.com/en/actions/get-started/quickstart) | Workflow/job/trigger/secrets; bổ sung service containers và deployment theo pipeline thực tế |
| R14 | [OWASP Cheat Sheet Series](https://owasp.org/projects/cheat-sheet-series) | Password Storage, Authentication, Session/JWT, CSRF, Authorization; đọc theo luồng bạn triển khai |
| R15 | [RabbitMQ Tutorials](https://www.rabbitmq.com/tutorials) | Chọn JavaScript, Hello World/Work Queues/Pub-Sub/Routing theo lab; tìm ack/confirm/DLQ trong docs khi triển khai |
| R16 | [AWS Free Tier plan conditions](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/free-tier-plans.html), [EC2 Getting Started](https://aws.amazon.com/ec2/getting-started/) | Hiểu compute/managed DB/storage/CDN/DNS và điều kiện tài khoản trước lab; không mặc định tất cả dịch vụ miễn phí |

Tài liệu chính bằng tiếng Anh; phần nhiệm vụ, giải thích và tự kiểm tra trong lộ trình dùng tiếng Việt. Mỗi phiên đọc chỉ lấy khoảng 2–5 thuật ngữ, tự viết lại ý bằng tiếng Việt rồi tự tạo ví dụ. Có thể dùng bản dịch của trình duyệt, nhưng giữ tên API/khái niệm gốc để tra lỗi.

Video là nguồn bổ trợ khi một chủ đề chưa rõ, không phải đầu việc bắt buộc hàng ngày. Với React, dùng [video do React tuyển chọn](https://react.dev/community/videos), chỉ xem phần liên quan sau React Learn; đây không thay thế bài nhập môn. Với chủ đề khác, chọn một video miễn phí đúng major, xem tối đa 30–45 phút trong phiên tài liệu rồi đóng video để tự làm bài. Bản Việt hóa nội dung và giải thích theo bài tập có thể thực hiện trong chat khi bạn gửi bài/ngày học; không cần mua khóa học.

## 9. Lịch từng ngày của tuần đầu

| Ngày | Trọng tâm | Bài thực hành và đầu ra |
|---|---|---|
| Chủ nhật 01/11 — 7 giờ | Bài đầu vào; primitive/reference; let/const; scope cơ bản | Dự đoán output trước khi chạy, thử mutation/reassignment; viết module xử lý sản phẩm; lưu bài sai và lý do |
| Thứ Hai 02/11 — 5 giờ | Scope, hoisting, TDZ; function declaration/expression | Ít nhất 5 ví dụ scope/hoisting, chạy debugger; mô tả vì sao một đoạn gây ReferenceError |
| Thứ Ba 03/11 — 5 giờ | Execution context/call stack; recursion | Vẽ stack cho ba lời gọi lồng nhau; dùng step-in/step-out; phân tích một lỗi stack overflow |
| Thứ Tư 04/11 — 5 giờ | Lexical environment, scope chain | So sánh nơi khai báo và nơi gọi function; viết factory function trả function; giải thích biến được resolve từ đâu |
| Thứ Năm 05/11 — 5 giờ | Closure và state được giữ | Viết `createCounter()` và `createCart()` có API nhỏ; hai cart độc lập; test bằng assert đơn giản |
| Thứ Sáu 06/11 — 5 giờ | this, arrow, prototype/class | So sánh method thường/arrow/callback mất this; kiểm tra prototype; giải thích method lookup bằng ví dụ |
| Thứ Bảy 07/11 — 5 giờ | Tích hợp, debug và nghiệm thu | Chốt cart; 10 bài mới đạt ít nhất 8/10; giải thích closure/reference/stack không nhìn tài liệu; README và danh sách còn yếu |

### Bài ngày 01/11/2026 — bắt đầu được ngay

**Kiến thức cần đạt:** phân biệt value và reference, mutation và reassignment, shallow copy; quan sát block scope; biết dùng debugger để kiểm tra giả thuyết. Tài liệu: R01, phần Grammar and types, Functions và Working with objects; chỉ đọc phần liên quan hôm nay.

| Thời lượng | Nhiệm vụ |
|---|---|
| 45 phút | Tự làm bài đầu vào: 8–10 câu ngắn về value/reference/scope, ghi dự đoán trước khi chạy |
| 60 phút | Đọc phần cần thiết trên MDN; ghi ba điều mới và hai câu hỏi |
| 90 phút | Chạy/sửa các ví dụ, đặt breakpoint; giải thích từng dòng output bằng lời của mình |
| 90 phút | Viết các hàm xử lý sản phẩm bên dưới và kiểm tra bằng `node:assert/strict` |
| 30 phút | Ghi nhật ký: lỗi, nguyên nhân, bằng chứng sửa đúng; học 3–5 thuật ngữ |
| 45 phút | Tự kiểm tra, dọn README, commit bài; đặt mục tiêu cho ngày 02/11 |
| 60 phút | Dự phòng hoặc nghỉ; không thêm framework mới |

**Bài tập áp dụng:**

1. Tạo danh sách ít nhất năm sản phẩm có `id`, `name`, `priceMinor`, `stock`. Dùng số nguyên cho `priceMinor`.
2. Viết `findProductById`, `filterInStock` và `calculateTotal(items)`; quy định rõ hành vi khi ID không có, số lượng âm hoặc không nguyên. Có thể throw lỗi và kiểm tra bằng assert.
3. Viết hàm cập nhật tồn kho trả danh sách mới, không làm thay đổi object đầu vào. Minh họa lỗi khi chỉ copy array mà vẫn sửa object bên trong.
4. Thêm một object lồng như `metadata`; so sánh copy bằng spread với việc copy đúng những tầng cần thay đổi. Giải thích vì sao không cần deep clone toàn bộ trong mọi thao tác.
5. Có ít nhất sáu assertion có ý nghĩa: tìm thấy/không có, filter, tổng tiền, input sai, input không bị mutate. Đây là bài tập học kiểm chứng, chưa cần cài Jest.

**Ba câu tự kiểm tra:**

1. Vì sao có thể sửa thuộc tính của object khai báo bằng `const`?
2. `const copy = [...products]` có bảo đảm sửa `copy[0].stock` không ảnh hưởng `products[0]` không?
3. Nếu hai biến giữ reference tới cùng object, bạn kiểm chứng điều đó bằng cách nào?

**Nộp bài:** file JS hoặc link commit, kết quả assert, giải thích ba câu hỏi và một lỗi bạn đã tự sửa. Không chép toàn bộ lời giải từ AI; có thể xin gợi ý, sau đó đóng lời giải và tự viết lại.

## 10. Cách điều chỉnh khi chậm hoặc nhanh hơn kế hoạch

1. Mỗi cuối tuần chấm bốn tiêu chí: giải thích được, tự code được, đầu ra chạy được, xử lý lỗi được. Mục quan trọng như auth/order phải đạt bằng test/bằng chứng, không lấy điểm trung bình để che một lỗi nghiêm trọng.
2. Trượt KPI nhẹ: dùng tối đa 7 giờ dự phòng/tuần, giảm xem video và việc trang trí. Không cộng thêm giờ vượt lịch để bù dài hạn.
3. Trượt một gate hoặc trễ từ một tuần: tạm ngừng nội dung nâng cao, dùng thời lượng tuần sau để sửa phần phụ thuộc; giữ hạn apply tháng 5, giảm phạm vi thay vì dồn thêm công nghệ.
4. Thứ tự cắt: lab Kafka/gRPC và AWS nâng cao → outbox/microservice lab → tính năng phụ/UI trang trí. Giữ JS/TS, auth/authorization, transaction, test quan trọng, tài liệu và demo.
5. Nhanh hơn: làm lại yêu cầu mới không nhìn code cũ, thêm failure cases, benchmark có kiểm soát và review. Không tự động nhảy sang Kubernetes hay framework khác.

**Chủ đề để sau khi có portfolio và bắt đầu ứng tuyển:** TypeORM ở mức đối chiếu Prisma, MongoDB schema/index sâu, Redux/SWR khi công việc yêu cầu, OAuth Google hoàn chỉnh, Kafka chuyên sâu, Kubernetes, multi-region và sharding production. Distributed lock, GC và conditional types có thể học sâu thêm theo nhu cầu; sáu tháng đầu chỉ cần nền tảng và ví dụ đúng phạm vi.

## 11. Checklist sẵn sàng ứng tuyển

- [ ] Tự giải thích stack/closure/Promise/event loop bằng ví dụ mới; đọc được lỗi TypeScript và xử lý runtime input.
- [ ] Tự thêm một feature nhỏ qua Next → Nest → DB mà không cần tutorial từng bước.
- [ ] Hiểu React render/effect và Next server/client/render/cache boundary.
- [ ] API có DTO validation, lỗi chuẩn, filter/sort/pagination có giới hạn, docs và test.
- [ ] Login/refresh/logout, role/permission và ownership có test thành công/lỗi; biết giới hạn thu hồi JWT.
- [ ] Đơn hàng dùng giá server, snapshot, transaction, bảo vệ tồn kho và idempotency có kiểm chứng concurrent requests.
- [ ] Giải thích một query plan và một quyết định index; biết chi phí index và migration.
- [ ] Redis có TTL/invalidation và hành vi khi lỗi; không dùng cache làm nguồn sự thật cho tồn kho.
- [ ] Hai project chính có README, env mẫu, dữ liệu seed, ảnh/video demo và giới hạn trung thực.
- [ ] Có clean setup bằng Docker, test pipeline, hướng dẫn deploy; phân biệt phần chạy local với phần public.
- [ ] Có logs/metrics, diễn tập backup/restore và ít nhất một báo cáo lỗi hoặc tối ưu có số đo.
- [ ] Giải thích hai bài System Design trong 30–40 phút; biết khi nào chưa cần microservices.
- [ ] CV có repo/demo truy cập được, mô tả đóng góp thật và không ghi kinh nghiệm/hiệu năng chưa có bằng chứng.

Đạt checklist là mốc để bắt đầu ứng tuyển và tiếp tục cải thiện qua phản hồi, không phải bảo đảm được tuyển hoặc đã có kinh nghiệm vận hành hệ thống lớn.

## 12. Mẫu báo cáo học hằng ngày

```text
Ngày / Tuần:
Thời gian học thực tế:
Mục tiêu hôm nay:
Đã làm được + link/file/bằng chứng:
Một khái niệm giải thích bằng lời của mình:
Lỗi đã gặp → nguyên nhân → cách kiểm chứng sau khi sửa:
Câu tự kiểm tra còn chưa trả lời được:
Điểm đang mắc:
```

Khi tiếp tục trong chat, gửi ngày/tuần và bài làm theo mẫu để nhận bài tiếp theo phù hợp kết quả thực tế. Roadmap và lịch ngày đầu đã có sẵn; chưa thiết lập thông báo hay gửi bài tự động.
