# Lộ trình cá nhân — Java Backend Intern → Backend-heavy Full-stack

Ngày lập: 03/11/2026. Thời hạn: 6 tháng kể từ Day 1. Đây là kế hoạch thích nghi theo assessment, không phải lịch buộc phải chuyển chủ đề sau một số ngày.

## 1. Cơ sở lập kế hoạch

- Sinh viên năm 3, làm project cá nhân; ưu tiên CV Java Backend Intern.
- Đã tiếp xúc MVC bằng JavaScript/Express.js. Tận dụng tư duy request/controller/service; kiểm tra riêng cơ chế Java/Spring.
- Có thể dành khung 8 giờ mỗi ngày, cả Chủ nhật.
- Project cần gọn, có backend tốt và một client full-stack dùng được.
- Từ 04/11/2026: dùng tiếng Anh cho dữ liệu mẫu/input/output trong chương trình; hướng dẫn bằng tiếng Việt. Theo yêu cầu người học, tạm bỏ qua việc xử lý hiển thị tiếng Việt ở terminal.
- Domain đã chọn: quản lý yêu cầu hỗ trợ nội bộ. Project cá nhân, phạm vi MVP gọn; xem [PROJECT_SCOPE.md](PROJECT_SCOPE.md).

### Skill matrix ban đầu

Mức là bằng chứng từ các câu đã kiểm tra; không đại diện toàn bộ chủ đề. Không có chủ đề nào đủ bằng chứng để chấm 🔵.

| Chủ đề | Mức | Bằng chứng / khoảng trống |
|---|---|---|
| Programming fundamentals | 🟡 | Viết được vòng lặp, điều kiện; thiếu trường hợp biên và kiểm chứng output |
| Java syntax | 🟡 | Có lỗi tên, constructor collection, nhầm API array/List |
| OOP | 🟡 | Constructor/interface cơ bản làm được; object identity và đa hình cần chắc hơn |
| Tham chiếu / truyền tham số | 🟠 | Nhầm sao chép tham chiếu và sao chép object; đã yêu cầu bỏ qua lượt kiểm tra đó |
| Exception | 🟡 | Theo được try/catch/finally sau hướng dẫn; chưa kiểm tra throw/throws và propagation |
| Collections | 🟡 | Hiểu List/Set/Map cơ bản; chưa kiểm tra equals/hashCode với object tự tạo |
| Generics | 🟠 | Chưa học chính thức; làm List<Integer> sau mini-review |
| Lambda / Stream | 🟠 / 🔴 | Đọc được một comparator lambda; chưa học Stream |
| Multithreading | 🔴 | Tự xác nhận chưa học |
| Git | 🟢 cơ bản | Hiểu staging/commit/push; merge/conflict chưa đánh giá |
| Maven | 🔴 | Chưa học |
| Test case / JUnit | 🟠 / 🔴 | Có expected result sai; chưa tự thiết kế được nhóm test; chưa học JUnit |
| SQL | 🟡 | SELECT/WHERE/JOIN có ý tưởng đúng; cần chính xác tên và DESC |
| Database concepts | 🟠 | PK/FK chưa chắc; chưa học transaction/index |
| HTTP | 🟡 | Method/status cơ bản tốt; cần chắc request và validation |
| REST | 🟡 một phần | Đã kiểm tra method/status; chưa đủ bằng chứng về API design |
| Spring | 🟠 | Có tư duy phân tầng; chưa biết DI, Boot, cơ chế xử lý lỗi |
| JavaScript / TypeScript / React | 🟡 cơ bản | Coercion cơ bản tốt; const, async, state, JSON còn nhầm; Next.js chưa đánh giá |
| DSA | 🟡 cơ bản | Hiểu stack, trực giác binary search; ký hiệu Big-O và đọc đề cần luyện |
| Linux / Docker | 🔴 / 🟠 | Linux chưa học; Docker mới biết ví von image/container |

### Liên hệ tuyển dụng

Đối chiếu ngày 03/11/2026, đây là mẫu nhỏ để định hướng, không phải thống kê thị trường:

- [Bosch — Java Web Developing Intern](https://jobs.smartrecruiters.com/BoschGroup/744000128399769): trang đọc được có nút ứng tuyển; nêu Java/OOP, web/API, database, testing, Git; không thấy ngày đóng để xác nhận thời hạn tuyển.
- [Techcombank — Intern Dev](https://www.techcombankjobs.com/job/TP_-Ha-Noi-Intern-Dev/60625644/): đăng 13/10/2026, trang đọc được có nút ứng tuyển; nêu DSA/OOP, SQL, HTTP/REST, ưu tiên Java cho backend; có đào tạo framework.

Suy luận cho người học này: nền tảng và khả năng hoàn thiện một ứng dụng có kiểm thử đáng được ưu tiên trước việc thêm nhiều công nghệ. Hai tin không chứng minh mọi công ty đều có cùng yêu cầu. Đối chiếu lại cuối mỗi tháng.

## 2. Project đã chọn — quản lý yêu cầu hỗ trợ nội bộ

Tên làm việc: SupportDesk. Một người gửi yêu cầu, nhân viên hỗ trợ tiếp nhận và xử lý; hai bên trao đổi qua bình luận và theo dõi trạng thái.

MVP có hai vai trò REQUESTER/AGENT; tạo/xem ticket, nhận xử lý, chuyển trạng thái, bình luận, lịch sử và danh sách có lọc/phân trang. Phạm vi nghiệp vụ, quyền và tiêu chí nghiệm thu ở [PROJECT_SCOPE.md](PROJECT_SCOPE.md).

Kiến trúc: modular monolith, một backend triển khai chung; hai vùng chức năng identity và support. Ticket/comment/history cùng nằm trong support. Console → PostgreSQL/JDBC → Spring REST/JPA/Security → React/Next.js → deploy; mỗi giai đoạn dựa trên prerequisite check.

## 3. Stack và cách dùng tài liệu/video

- Nền tảng học Java dự kiến: JDK 21, dùng API documentation đúng phiên bản. Lựa chọn này phục vụ tính nhất quán của khóa học, không phải kết luận mọi nhà tuyển dụng dùng Java 21.
- Maven làm build tool chính; thêm Maven Wrapper khi học Maven.
- JUnit Jupiter; version được khai báo rõ trong Maven, và dùng bộ dependency do Spring Boot quản lý khi chuyển sang Boot. Tài liệu JUnit hiện tại đã là dòng 6; không sao chép mù dependency từ video cũ.
- PostgreSQL, Spring Boot, Spring MVC, Spring Data JPA/Hibernate, Spring Security.
- TypeScript → React → Next.js App Router. Client dùng API Spring; business rules chính nằm trong backend.
- Docker Compose và CI; chọn môi trường deploy sau khi biết ngân sách và hạ tầng có sẵn.
- Chọn bản stable tương thích khi khởi tạo project, không dùng snapshot/RC. [Boot System Requirements](https://docs.spring.io/spring-boot/system-requirements.html) là nguồn đối chiếu JDK/build tool; không tự chọn riêng version Hibernate/Security trái bộ dependency của Boot.

Video chính: [Telusko](https://www.youtube.com/watch?v=q6z_UCBM5Ek).

**Giới hạn xác minh timestamp:** công cụ đọc YouTube không lấy được danh sách chapter/transcript. Các mốc dưới đây được giữ từ nội dung bạn cung cấp. Chưa xác minh được mốc nhỏ bên trong Core Java. Khi mở Study Pack, chỉ ghi khoảng xem nhỏ sau khi đối chiếu được; nếu chưa có sẽ nói rõ, không bịa timestamp. Khoảng chapter trong kế hoạch là nơi tra cứu, không phải yêu cầu xem hết.

## 4. Phân loại toàn bộ chapter

MUST LEARN = cần đạt đầu ra; có thể skip video nếu vượt bài kiểm tra. SHOULD LEARN = học sau phần bắt buộc và cắt trước nếu thiếu thời gian. OPTIONAL = tự chọn khi còn dư. SKIP FOR NOW = không đưa vào phần cam kết 6 tháng.

| Chapter / mốc bắt đầu | Mức | Phạm vi cho mục tiêu hiện tại |
|---|---|---|
| Core Java — 00:00:00 | MUST LEARN | Chọn đúng khoảng trống; không xem lại toàn bộ 13 giờ |
| Maven — 13:32:51 | MUST LEARN | POM, dependencies, lifecycle, test/package, wrapper |
| Gradle — 15:42:13 | SKIP FOR NOW | Chỉ nhận diện đây là build tool khác |
| JUnit — 16:13:17 | MUST LEARN | Assertions, exceptions, parameterized tests; test business rules |
| Git — 19:04:46 | MUST LEARN | Review nhanh staging/commit; tập branch/merge/conflict |
| DSA — 21:05:16 | MUST LEARN | Big-O, array/string/hash, stack/queue, search, recursion/tree cơ bản |
| JDBC — 26:12:28 | MUST LEARN | PreparedStatement, mapping, tài nguyên, transaction |
| Servlets & JSP — 28:39:36 | SHOULD LEARN | Request lifecycle, servlet container; bỏ xây ứng dụng JSP |
| REST API / Web Services — 32:08:43 | MUST LEARN | HTTP/JSON, resource, validation, lỗi, pagination; bỏ công nghệ ngoài mục tiêu REST |
| ORM — 34:43:17 | MUST LEARN | Bài toán object–relational mapping |
| Hibernate — 34:53:11 | MUST LEARN | Entity, lifecycle, relationships, fetching; không học mọi tính năng |
| Spring Framework — 35:44:49 | MUST LEARN | IoC/DI/bean, cấu hình; hiểu trước annotation |
| Spring Boot REST — 37:38:20 | MUST LEARN | Request flow, controller/service, DTO, validation, lỗi |
| Spring JDBC — 38:55:14 | SHOULD LEARN | So sánh với JDBC thuần; bài nhỏ, không xây thêm tầng persistence song song |
| Spring Data JPA — 39:24:38 | MUST LEARN | Repository, query, pagination, transaction |
| Spring Boot MVC Project — 39:55:47 | SHOULD LEARN | Đọc request flow/phân tầng; lướt server-rendered view nếu đã hiểu |
| Spring Security — 41:40:32 | MUST LEARN | Authentication, authorization, password storage, security filter chain |
| JWT — 43:36:28 | SHOULD LEARN | Hiểu token, expiry và validation; không mặc định mọi app phải dùng JWT |
| OAuth2 — 44:40:32 | SHOULD LEARN | Hiểu vai trò các bên và phân biệt OAuth2/OIDC; tích hợp thực tế nếu cần |
| Logging — 44:56:28 | MUST LEARN | Log hữu ích để tìm lỗi, mức log, tránh lộ dữ liệu nhạy cảm |
| MongoDB Project — 46:03:03 | SKIP FOR NOW | Dồn thực hành persistence cho PostgreSQL |
| Docker — 47:18:23 | MUST LEARN | Image/container, Dockerfile, network, volume, Compose |
| Cloud Deployment — 49:30:26 | MUST LEARN | Đạt đầu ra deploy; thao tác provider đối chiếu docs lúc thực hiện |
| Spring AI — 51:00:41 | OPTIONAL | Chỉ sau khi ứng dụng cốt lõi đã hoàn thiện |
| Microservices — 52:08:08 | SKIP FOR NOW | Chỉ đổi mức sau gate nền tảng và khi có lý do thiết kế |
| Kafka — 54:15:20 | OPTIONAL | Producer/consumer và trade-offs; không bắt buộc thêm broker vào project |
| Linux — 55:34:32 | MUST LEARN | File, process, env, permission, log, thao tác deploy cơ bản |
| Ansible — 57:10:25 | OPTIONAL | Không nằm trong đầu ra tối thiểu |
| Jenkins — 58:56:44 | SKIP FOR NOW | CI là MUST; chọn một hệ thống CI phù hợp repository để thực hành |
| Terraform — 60:13:33 | SHOULD LEARN | Fundamentals sau khi đã deploy; bỏ trước nếu ảnh hưởng phần cốt lõi |

Redis không nằm trong danh sách chapter bạn cung cấp: SHOULD LEARN có điều kiện, chỉ sau khi đo được bài toán phù hợp để cache.

## 5. Macro roadmap 6 tháng

Khung gồm khoảng 26 tuần; tuần cuối kết thúc theo hạn 6 tháng thực tế, không cộng thêm thời gian. Nếu gate chưa đạt, dùng quỹ tuần sau để bù và cắt phần ưu tiên thấp, không kéo dài deadline.

| Giai đoạn | Trọng tâm | Đầu ra phải chứng minh |
|---|---|---|
| Tháng 1 | Java Core có chọn lọc + Git/Maven/JUnit | Console app có business rules và test; giải thích được code |
| Tháng 2 | PostgreSQL, transaction/index, JDBC, HTTP/JSON | Lưu dữ liệu bền vững; transaction có rollback; hợp đồng API viết rõ |
| Tháng 3 | IoC/DI, Boot/MVC, REST, DTO/validation, JPA nền tảng | Một luồng nghiệp vụ chạy từ request đến database, có test |
| Tháng 4 | JPA/transaction/fetching + Security + client React | Backend usable; quyền được kiểm tra; frontend gọi API thật |
| Tháng 5 | Linux/Docker/CI/deploy + Next.js | Demo online; CI chạy test; luồng người dùng đầu-cuối dùng được |
| Tháng 6 | Hoàn thiện full-stack, chất lượng, portfolio/phỏng vấn | README, dữ liệu demo, test, deploy ổn định; giải thích trade-offs |

Phân bổ định hướng theo tổng giờ học: backend/software engineering khoảng 70%, frontend khoảng 30%. Tuần 1–4 tập trung backend; tuần 5–8 khoảng 10% frontend để sửa JS/JSON; tuần 9–20 khoảng 30%; tuần 21–24 khoảng 75%; tuần 25–26 khoảng 40%. Chỉnh theo kết quả hằng tuần; không đồng thời bắt đầu nhiều framework khi Java còn yếu.

## 6. Kế hoạch theo tuần

Các mã tài liệu trong cột Docs trỏ tới danh mục link ở mục 9. Video ngoài Telusko không bắt buộc. Các giai đoạn console/backend/client cùng phát triển project SupportDesk; mốc chức năng cụ thể ở PROJECT_SCOPE.md.

| Week | Main Topic | Video cần tra | Official Docs | Practice | Project |
|---|---|---|---|---|---|
| 1 | Java: array/reference/OOP, exception, generics, List/Set/Map | Core Java: 00:00:00–13:32:51, chọn đoạn | J-OOP, J-EX, J-GEN, J-COL | Predict/debug; object equality; edge cases | Ticket console trong bộ nhớ, tạo/xem danh sách |
| 2 | Maven, test case/JUnit, Comparator, lambda/Stream cơ bản | Maven 13:32:51; JUnit 16:13:17; Core Java chọn đoạn | MAV, TEST, J-GEN, J-COL | Red/green tests, chuyển loop sang pipeline | Business rules có test |
| 3 | Optional, File I/O, try-with-resources, Git branch/merge | Core Java chọn đoạn; Git 19:04:46 | J-EX, JAVA, GIT | Save/load; xử lý file hỏng; conflict có chủ đích | Persistence file đơn giản |
| 4 | Concurrency cơ bản, race condition, Java gate | Core Java chọn đoạn; DSA 21:05:16 | JAVA, TEST | Chứng minh lost update; debugging tổng hợp | Console có README và tests |
| 5 | PostgreSQL, schema, constraints, PK/FK, JOIN | JDBC 26:12:28 chỉ phần cần; SQL dùng docs | PG | Thiết kế schema, dữ liệu phản ví dụ | Schema domain + script tạo dữ liệu |
| 6 | Transaction/ACID/isolation; index và EXPLAIN | Docs chính | PG | Rollback, hai phiên DB, query trước/sau index | Business rule cần tính nguyên tử |
| 7 | JDBC, PreparedStatement, resource/transaction | JDBC 26:12:28–28:39:36 chọn đoạn | JDBC, PG | Mapping và integration test database | Thay file bằng PostgreSQL |
| 8 | HTTP/JSON/REST, Servlet mental model; gate | Servlet 28:39:36 phần cần; REST 32:08:43 | HTTP, SERVLET, PG | Request bằng công cụ; hợp đồng API, lỗi/pagination | API spec dựa trên nghiệp vụ đã có |
| 9 | IoC/DI/bean, Boot startup/config | Spring 35:44:49; Boot 37:38:20 | SPR, BOOT | So sánh manual wiring với container | Khởi tạo Boot; một module trước |
| 10 | MVC, DTO, validation, exception handling | Boot REST; MVC project chọn flow | SPR, BOOT | Invalid input, not found, mapping DTO | Một vertical slice có API test |
| 11 | ORM/JPA lifecycle, repository và mapping cơ bản | ORM 34:43:17; Hibernate 34:53:11; JPA 39:24:38 | ORM, JPA | Entity states, SQL sinh ra | Chuyển persistence khi đã hiểu JDBC |
| 12 | Unit/integration/API tests; Spring gate | JUnit/Boot chọn đoạn | TEST, SPR, BOOT | Mock đúng biên; happy/error paths | Backend có luồng nghiệp vụ hoàn chỉnh |
| 13 | JPA relationships, transactions, pagination | Hibernate/JPA chọn đoạn | ORM, JPA, SPR | SQL count, pagination; JS→TS review | Danh sách, chi tiết, quan hệ dữ liệu |
| 14 | Fetching/N+1, query plan, constraints | Docs chính | ORM, JPA, PG | Đo query trước/sau; React component/state check | Truy vấn đã đo và sửa |
| 15 | Security fundamentals; authentication/password | Security 41:40:32 | SEC | Test login, invalid credentials; React forms | Đăng nhập và giao diện tối thiểu |
| 16 | Authorization/ownership; session/token; gate | Security; JWT 43:36:28; OAuth2 44:40:32 chọn phần | SEC | Test không đăng nhập/không đủ quyền; lỗi/loading | Backend usable + client dùng thử |
| 17 | Linux, Dockerfile, Compose, networking/volume | Docker 47:18:23; Linux 55:34:32 | DOCKER, LINUX | Rebuild, persistent DB, kết nối qua service name | App + PostgreSQL chạy bằng Compose |
| 18 | CI, config, logging, health, deployment | Logging 44:56:28; Cloud 49:30:26 | BOOT, DOCKER, CI | Test pipeline fail/pass, xem log, healthcheck | Bản deploy đầu; client gọi API online |
| 19 | Reliability: validation/error/idempotency theo nhu cầu | Docs chính | BOOT, HTTP, PG | Retry/double-submit và ranh giới transaction | Sửa failure paths thực tế |
| 20 | Backend quality gate; React state/forms/API | Docs chính | REACT, TS, SEC | Review backend; client auth/error states | Chốt phạm vi backend cốt lõi |
| 21 | React→Next.js; routing/layout/server-client boundary | Không có trong Telusko | REACT, NEXT | CSR/SSR mental model; nhận diện nơi code chạy | Chuyển client theo từng luồng |
| 22 | Forms/mutations/auth integration; loading/error | Không có trong Telusko | NEXT, SEC | Server-side auth checks; lỗi mạng/validation | Hoàn thiện luồng nghiệp vụ chính |
| 23 | Full-stack test, accessibility cơ bản, deployment | Docs chính | NEXT, BOOT, DOCKER | E2E happy path + quyền/lỗi quan trọng | Deploy full-stack và dữ liệu demo |
| 24 | Hoàn thiện và đo; caching chỉ nếu có lý do; gate | Redis docs; Kafka chỉ nếu gate đạt và dư giờ | BOOT, PG, REDIS | Đo bottleneck; test trước/sau thay đổi | App được nghiệm thu theo user stories |
| 25 | Quỹ bù, refactor có lý do, portfolio/CV | Xem lại đúng khoảng trống | Docs theo gap | Mock interview Java/SQL/HTTP; đọc code | README, sơ đồ, hướng dẫn chạy, demo |
| 26 | Gate cuối, sửa lỗi, ứng tuyển và luyện trình bày | Không học chapter lớn mới | Docs theo gap | Tự build/test/deploy; giải thích quyết định | Bản portfolio hoàn thiện trong hạn |

## 7. Hai tuần đầu — lịch gần, có thể điều chỉnh

Đây là kế hoạch ngày, chưa phải Study Pack. Khi mở từng ngày: mục tiêu → 3–7 prerequisite questions → chờ trả lời. Chỉ sau khi đạt mới đưa bài giảng, đoạn video, docs cụ thể và bài tập không kèm solution.

| Day | Chủ đề | Đầu ra kiểm chứng | Docs đọc trước tiên |
|---|---|---|---|
| 1 | Array/List, biến tham chiếu, pass-by-value; kiểm tra môi trường | Phân biệt sửa object và gán lại biến qua 3 tình huống mới; xác nhận Java/IDE/Git chạy được | J-OOP: Classes and Objects, passing information to a method; API ArrayList |
| 2 | OOP chọn lọc: encapsulation, constructor, composition/interface | Viết class bảo vệ một invariant; giải thích hai cách thay implementation | J-OOP: constructors, access, interfaces; chưa đọc inheritance nâng cao |
| 3 | Exception và validation | Theo luồng try/catch/finally; phân biệt throw/throws; không biến lỗi thành kết quả thành công giả | J-EX: catch/handle, throw, catch-or-specify |
| 4 | Generics và wrapper cơ bản | Giải thích List<T>, viết Box<T> nhỏ; nhận ra lỗi compile thay vì chờ runtime | J-GEN: generic types/type parameters; chưa học wildcard bounds |
| 5 | List/Set/Map, vòng lặp | Chọn đúng cấu trúc cho 3 bài; code không trộn array API với List API | J-COL: List, Set, Map; bỏ NavigableMap/implementation internals |
| 6 | equals/hashCode; dùng object tự tạo trong Set/Map | Giải thích duplicate theo equality; kiểm tra prerequisite trước khi dùng custom key | API Object.equals/hashCode; J-COL: Set/Map; chưa học treeification |
| 7 | WEEK 1 REVIEW | Knowledge map, 1 bài tổng hợp, 3–5 câu interview, review console và điều chỉnh tuần 2 | Đọc lại đúng gap; không thêm chapter |
| 8 | Maven | Giải thích POM/dependency/plugin ở mức cơ bản; chạy compile/test/package | MAV: POM, compiling, testing, packaging, dependencies; bỏ site deployment |
| 9 | Test case + JUnit Jupiter | Chọn normal/boundary/invalid cases; viết assertions kiểm tra kết quả | TEST: first test, assertions, exception assertions; bỏ extension model |
| 10 | Testing business rules, exception paths | Test phát hiện một bug có chủ đích; viết tên test diễn đạt hành vi | TEST: exception assertions/parameterized tests khi cần |
| 11 | Comparable/Comparator | Sắp xếp theo một rồi hai tiêu chí; xử lý bằng nhau rõ ràng | API Comparable/Comparator, List.sort; chưa làm parallel sort |
| 12 | Functional interface và lambda | Viết lambda tương đương implementation ngắn; giải thích tham số/return | J-GEN: Lambda Expressions; chưa học pattern matching |
| 13 | Stream cơ bản | Chuyển vòng lặp filter/map thành pipeline, so sánh kết quả; phân biệt dữ liệu và pipeline | Dev.java Streams: tạo stream, intermediate/terminal; bỏ parallel streams và collector nâng cao |
| 14 | WEEK 2 REVIEW | Bài console có Maven/tests; kiểm tra lại gap và lập ngày 15–28 theo kết quả | Docs cho gap; không mở chủ đề lớn mới |

Console dùng domain SupportDesk: tạo ticket, liệt kê, tìm theo ID, rồi bổ sung quy tắc trạng thái khi đã kiểm tra prerequisite. Không cần database, Spring hay đăng nhập ở giai đoạn Java Core.

### Khung một ngày 8 giờ

| Hoạt động | Thời lượng |
|---|---|
| Recall/spaced review + DSA | 60 phút, gồm DSA 20–40 phút |
| Docs và video chọn lọc | 75 phút |
| Code bài nhỏ, debug, giải thích bằng lời | 120 phút |
| Project SupportDesk hoặc bài tổng hợp theo prerequisite | 90 phút |
| Test/code review | 30 phút |
| Ghi learning log và câu hỏi còn vướng | 15 phút |
| Nghỉ, chia giữa các phiên | Tổng 90 phút |

Tổng khung 8 giờ, khoảng 6 giờ 30 phút học tập trung. Chủ nhật vẫn học: ưu tiên review, assessment, sửa lỗi và lập tuần kế tiếp.

## 8. Gates và cơ chế thích nghi

Mỗi gate dùng code mới, câu hỏi giải thích và lỗi có chủ đích. Không cho qua vì xem hết video. Topic đạt 🟢/🔵: skip hoặc review ngắn rồi kiểm tra. Chưa đạt prerequisite: mini-review và kiểm tra lại trước nội dung phụ thuộc.

| Gate | Điều kiện có bằng chứng |
|---|---|
| Cuối tháng 1 | Tự code console; giải thích reference/OOP; dùng generics/List/Set/Map; xử lý exception; test edge cases; build Maven và thao tác Git |
| Cuối tháng 2 / trước Spring | Java gate + SQL/JOIN/constraints; transaction rollback; JDBC resources; HTTP/JSON/API contract |
| Cuối tháng 3 | Giải thích DI và request flow; vertical slice chạy được; validation/lỗi đúng; test business rules và API |
| Cuối tháng 4 | Backend usable; quan hệ dữ liệu và transaction có lý do; phát hiện N+1; kiểm tra quyền và ownership bằng test |
| Cuối tháng 5 | Compose + CI + deployment; đọc log tìm lỗi; frontend kết nối API; xử lý lỗi/loading |
| Cuối tháng 6 | Tự chạy từ checkout sạch theo README; tests pass; demo luồng chính và lỗi/quyền; giải thích thiết kế và giới hạn |

Mỗi WEEK REVIEW gồm knowledge map, weak points, 1 coding assessment, 3–5 interview questions, project progress và next-week adjustment.

Review concept quan trọng ở +1/+3/+7/+14/+30 ngày tính từ buổi học thực tế, đổi ngữ cảnh câu hỏi. Nếu vắng buổi, đưa phần đến hạn vào buổi học tiếp theo. Lịch này không tự tạo reminder/automation.

Khoảng trống ưu tiên: reference/pass-by-value; array vs List; expected test result/edge cases; JSON number vs string; const binding vs mutation; async/await; React state/render; PK/FK. Phần reference đã từng được yêu cầu bỏ qua: ghi nhận gap, không tự coi là đạt; chỉ kiểm tra lại khi quay vào chủ đề phụ thuộc và tôn trọng yêu cầu skip tiếp nếu có.

Nếu thiếu thời gian: cắt Kafka, Microservices, Spring AI, MongoDB, advanced DevOps trước; tiếp đến Redis, OAuth2 implementation, Terraform. Giữ Java/SQL/HTTP, Boot/JPA/transactions, Security, tests, Git/Maven, Docker/deploy và client tối thiểu. Hai tuần cuối là quỹ hoàn thiện/bù, không dùng để thêm một stack mới.

## 9. Official documentation để tra theo tuần

Các link current sẽ được đối chiếu lại lúc mở Study Pack; API phải khớp version project. Dưới đây chỉ là danh mục đọc có chọn lọc, không yêu cầu đọc hết.

- **JAVA:** [Dev.java](https://dev.java/learn/) — chọn language/API đúng chủ đề; [Java 21 API](https://docs.oracle.com/en/java/javase/21/docs/api/index.html) — tra class/method đang dùng, không đọc tuần tự toàn bộ API.
- **J-OOP:** [Object Oriented Programming](https://dev.java/learn/language/oop/) — Classes and Objects, Interfaces, constructors/access/parameters; nhằm hiểu object và hợp đồng; bỏ records/inheritance sâu ở tuần 1.
- **J-EX:** [Exceptions](https://dev.java/learn/language/annotations-exceptions/exceptions/) — What Is an Exception, Catching and Handling, Specifying/Throwing; hiểu control flow trước custom hierarchy.
- **J-GEN:** [Generics, Lambda](https://dev.java/learn/language/fp/) — Generics và Lambda Expressions; bỏ pattern matching. [Generics introduction](https://dev.java/learn/generics/intro/) bổ sung nếu đường dẫn còn khả dụng.
- **J-COL:** [Collections Framework](https://dev.java/learn/api/collections-framework/) — List/Set/Map và iteration trước; bỏ sorted/navigable collections, advanced map lambdas lúc đầu.
- **STREAM:** [Dev.java API learning](https://dev.java/learn/) — mục Streams; chỉ pipeline cơ bản sau khi qua loop/lambda prerequisite.
- **MAV:** [Maven Getting Started](https://maven.apache.org/guides/getting-started/) — POM, compile/test/package, external dependencies; không cần publishing/site hay custom plugin.
- **GIT:** [Pro Git](https://git-scm.com/book/en/v2) — 2.2–2.5, 3.1–3.2; skip bài nhập môn đã qua assessment, chưa cần internals/rebase nâng cao.
- **TEST:** [JUnit User Guide](https://docs.junit.org/current/user-guide/) — Writing Tests in JUnit Jupiter: first test, assertions, exceptions; Build Support/Maven khi setup; bỏ Vintage/extension/launcher APIs.
- **PG:** [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html) — SQL, JOIN, Foreign Keys, Transactions trước; sau đó tới chapters Indexes, Concurrency Control và EXPLAIN theo bài cụ thể; chưa học replication/admin nâng cao.
- **JDBC:** [Java 21 java.sql API](https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/package-summary.html) — Connection, PreparedStatement, ResultSet; hiểu resource và transaction boundary.
- **HTTP:** [HTTP Semantics — RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html) — chỉ tra method/status khi cần; không đọc toàn bộ RFC trong một ngày. [JSON — RFC 8259](https://www.rfc-editor.org/rfc/rfc8259.html) — values/types để sửa nhầm number/string.
- **SERVLET:** [Jakarta Servlet](https://jakarta.ee/specifications/servlet/) — request/response và container lifecycle; không mở project JSP.
- **SPR:** [Spring Framework Reference](https://docs.spring.io/spring-framework/reference/) — Core/IoC, Web Servlet/MVC, Testing và Transactions; bỏ WebFlux/AOP nâng cao ở đầu.
- **BOOT:** [Spring Boot Reference](https://docs.spring.io/spring-boot/reference/) — configuration, profiles, web, testing, logging/Actuator theo bài; chưa học native image.
- **ORM:** [Hibernate User Guide](https://docs.hibernate.org/orm/current/userguide/html_single/) — entity, persistence context, associations, fetching; chọn section cụ thể, không đọc cả guide.
- **JPA:** [Spring Data JPA](https://docs.spring.io/spring-data/jpa/reference/) — repositories, query methods, pagination, transactions; bỏ Envers và custom infrastructure lúc đầu.
- **SEC:** [Spring Security](https://docs.spring.io/spring-security/reference/) — Servlet architecture, authentication, authorization, password storage; CSRF/CORS và browser integration khi thiết kế auth; không tự viết crypto/token validation.
- **TS:** [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) — Basics, Everyday Types, Narrowing, Functions; bỏ type-level programming nâng cao.
- **REACT:** [React Learn](https://react.dev/learn) — components, state snapshot, forms, sharing state, escape hatches khi cần; ưu tiên hiểu render trước thêm state library.
- **NEXT:** [Next.js Docs](https://nextjs.org/docs) — layouts/pages, server/client components, fetching/mutating data, error handling, deploy; API business chính vẫn gọi Spring.
- **DOCKER:** [Docker Get Started](https://docs.docker.com/get-started/) — New to Docker tutorial: image/container, application stack, volume/network; bỏ orchestration nâng cao.
- **LINUX:** [GNU Coreutils](https://www.gnu.org/software/coreutils/manual/coreutils.html) và man pages trên môi trường sử dụng — chỉ pwd/ls/cat/tail/env/permission theo task; thêm process/log khi deploy.
- **CI:** [GitHub Actions Docs](https://docs.github.com/en/actions) nếu chọn GitHub — workflow chạy Maven tests/build; chọn docs tương ứng nếu repository ở nền tảng khác.
- **REDIS:** [Redis Docs](https://redis.io/docs/latest/) — cache/TTL/invalidation khi có bài toán; chưa học cluster.
- **KAFKA:** [Apache Kafka Documentation](https://kafka.apache.org/documentation/) — chỉ khi core gate đạt và còn thời gian; producer/consumer, delivery và ordering trade-offs trước.

## 10. Việc tiếp theo

1. Domain đã chọn và MVP ban đầu đã được ghi tại PROJECT_SCOPE.md; giữ phạm vi gọn theo mục tiêu CV Java Backend Intern.
2. Điểm bắt đầu: Day 1 — array/List, tham chiếu và truyền tham số; prerequisite check trước, không đưa sẵn solution. Xác nhận môi trường trước khi code.
3. Dùng bài Java nhỏ để xây SupportDesk từng bước; chưa sinh sẵn code toàn project cho người học.
4. Ghi nhận kết quả thực tế rồi điều chỉnh lịch 1–2 tuần gần nhất. Không coi bảng kế hoạch là bằng chứng đã học xong.
