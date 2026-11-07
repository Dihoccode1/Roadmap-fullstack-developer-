# MiniCommerce — Java Learning Roadmap

My six-month learning goal is to build the skills needed to develop MiniCommerce. This repository records my Java exercises, learning notes, and progress.

## Roadmap

The roadmap below covers the first two days of the learning plan. More days will be added as their requirements are defined.

### Day 1 — Java Environment and First Program

**Topics**

- JDK and JVM: development tools and bytecode execution.
- The compilation workflow: `.java` → `javac` → `.class` → `java`.
- Program structure using `class Main` and `public static void main(String[] args)`.
- Printing output with `System.out.println`.
- Compilation errors, runtime errors, and logic errors.
- Basic Git commands: `init`, `status`, `add`, `commit`, and `log`.

**Practice**

1. Install JDK 21 and IntelliJ IDEA with free Java support.
2. Verify that `java -version` and `javac -version` both report version 21.
3. Create `Main.java` and print my name, six-month goal, and the project name MiniCommerce.
4. Run the program in IntelliJ IDEA and from the terminal.
5. Remove a semicolon, read the compiler error, and fix it.
6. Initialize Git, ignore `*.class` files, and create the first commit.

**Completion checklist**

- [ ] Run the program in both the IDE and the terminal.
- [ ] Identify the source file and the compiled bytecode file.
- [ ] Save the code and run instructions in Git.
- [ ] Fix a syntax error independently.

**Self-check**

1. Why do we use `java Main` instead of `java Main.class`?
2. What happens when the source changes but the old `.class` file is executed?

**Resources**

- [Eclipse Temurin JDK 21](https://adoptium.net/temurin/releases/?version=21)
- [Dev.java — Your First Java Code](https://dev.java/learn/first-steps/first-java-code/)
- [Pro Git — Recording Changes](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository)
- freeCodeCamp video: Hello World chapter from the course used in the learning plan.

### Day 2 — Product Price Calculator

**Topics**

- Types: `int`, `long`, `double`, `boolean`, `char`, and `String`.
- Variable declarations, assignments, `final`, and naming conventions.
- Arithmetic, comparison, and logical operators.
- Integer division, basic casting, and overflow risks.
- Keyboard input with `Scanner`: `nextLine()`, `nextInt()`, and `nextLong()`.
- Why `nextLine()` can return an empty string after reading a number.

**Practice**

1. Read a product name, unit price, and quantity, then print the total price.
2. Calculate the average price of two products without losing the fractional part.
3. Test a product name containing spaces.
4. Test a unit price of `3000000000` to understand why `long` is needed.

Example input and expected result:

```text
Product name: Bàn phím
Unit price: 250000
Quantity: 3
Expected total: 750000
```

**Completion checklist**

- [ ] Read the full product name, including spaces.
- [ ] Choose appropriate types for prices and quantities.
- [ ] Calculate the correct total for the sample data.
- [ ] Calculate an average that preserves the fractional part.
- [ ] Explain the difference between `5 / 2` and `5.0 / 2`.

**Self-check**

1. Does multiplying two `int` values and assigning the result to a `long` always prevent overflow?
2. Why can `nextLine()` immediately after `nextInt()` return without waiting for a name?

**Resources**

- [Dev.java — Java Language Basics](https://dev.java/learn/language/constructs/basics/)
- [Java 21 — Scanner](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Scanner.html)
- freeCodeCamp video: Variables, Data Types, Operators, and User Inputs chapters from the course used in the learning plan.

## Week 1 Conventions

- Use JDK 21.
- Keep the full `public class Main` and `public static void main(String[] args)` structure.
- Use `long` for prices expressed in whole Vietnamese đồng, with no fractional currency units.
- For the Day 2 average exercise, use `double` to preserve fractional results.
- Week 2 will introduce `BigDecimal` for monetary calculations involving fractional amounts and rounding rules.
- Exclude compiled `*.class` files from Git.

## How to Run an Exercise

Open a terminal in the directory containing the exercise's `Main.java` file:

```bash
javac Main.java
java Main
```

Recompile after saving source changes so the output reflects the latest code.

Alternatively, open the exercise in IntelliJ IDEA, select JDK 21 as the project SDK, and run the `main` method.

## Git Quick Reference

```bash
git init
git status
git add README.md .gitignore Main.java
git commit -m "Complete Java learning exercise"
git log --oneline
```

The `git add` example assumes these files exist in the current directory. Adjust the paths to match the exercise location.

Add the following rule to `.gitignore` before staging compiled exercises:

```gitignore
*.class
```
