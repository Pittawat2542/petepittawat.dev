# Thai Blog Writing Principles (สไตล์การเขียนบล็อกภาษาไทย)

This document outlines the core principles, unique styles, and conventions for writing **Thai blog posts** on this platform. To ensure consistency, readability, and a strong brand voice, all Thai content must follow these guidelines.

---

## 1. First Principles & Ideology

When writing in Thai, do not merely translate English articles word-for-word. Instead, re-conceptualize and adapt the content using the following core pillars:

| Principle                                     | Description                                                                          | Thai Implementation                                                                                                                    |
| :-------------------------------------------- | :----------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| **Naturalization (การเรียบเรียงโดยธรรมชาติ)** | Rewriting English structures and idioms into fluid, idiomatic Thai.                  | Avoid passive voice structures (e.g., "ได้รับการค้นพบโดยผม...") and long, nested clauses. Use active, conversational Thai phrasing.    |
| **Bilingual Technical Fluidity**              | Maintaining English coding terms alongside natural Thai explanations.                | Keep code-level terms in English (either inline or in `code` blocks). Do not translate established developer jargon into awkward Thai. |
| **Memorability through Analogy**              | Substituting generic coding examples with creative, real-world analogies.            | Use culturally accessible, concrete analogies (e.g., _โรงงานลูกอม_ for extension methods, _การซูมเข้า/ซูมออก_ for problem-solving).    |
| **Philosophical Depth**                       | Connecting daily programming tasks to broader computer science and human principles. | Conclude technical discussions by reflecting on their meaning (e.g., linking error handling to predicting the future).                 |

---

## 2. Voice, Tone & Persona

The author persona for Thai blogs is a **peer-to-peer collaborator** who is intellectual, humble, and encouraging:

- **Sincere Pronouns:** Always use **"ผม"** (I) for the author and **"คุณ"** (you) or **"เรา"** (we/us) to address the reader. This establishes a polite yet warm, friendly relationship.
- **The "Co-Explorer" Tone:** Never speak from a position of absolute authority or look down on the reader. Use phrases like _"ผมพบว่า..."_, _"หวังว่า..."_, or _"ในมุมมองของผม..."_.
- **Thought-Provoking Inquiries:** Conclude main sections or summaries with open-ended reflective questions to prompt the reader to evaluate their own code or workflow (e.g., _"ทักษะอะไรที่กำลังขับเคลื่อนชีวิตคุณอยู่?"_).

---

## 3. Handling Language, Jargon, and Code

Thai developers naturally think in English when writing code. The text should reflect this reality:

### 3.1 Coding Jargon & Technical Terms

- **Keep in English:** Standard technical and architectural terms should remain in English (lowercase/normal text or formatted as `code` blocks) to prevent readability issues.
  - _Examples:_ `DataFrame`, `jargon`, `feedback loop`, `energy landscape`, `attention`, `Transformer`, `growth mindset`, `dry`, `srp`
- **Transliteration with English Parentheses:** For non-technical general concepts, write the Thai transliteration first, followed by the English term in parentheses.
  - _Examples:_ `Hygge (ฮุกกะ)`, `ความทรหด (grit)`, `ความสนใจ (attention)`

### 3.2 Grammatical Polishing (Thai-specific)

- **Avoid "Verb-to-Be" Overuse:** In Thai, translating "is/am/are" literally often results in awkward sentences.
  - _Bad:_ "K-Means เป็นวิธีที่..."
  - _Good:_ "K-Means คือแนวทางแบบ..."
- **Active Voice:** Write direct sentences.
  - _Bad:_ "โค้ดจะถูกเขียนโดยนักพัฒนา..."
  - _Good:_ "นักพัฒนาเขียนโค้ด..."

---

## 4. Layout, Formatting & MDX Components

Every Thai blog post should follow a highly scannability-optimized layout:

### 4.1 Required Structural Headings

1. **บทนำ (Introduction):** Introduce the topic using a personal hook, historical reference, or a common misconception.
2. **TLDR; (ถ้าเหมาะสม):** Place a summary block near the top for quick scanning.
3. **เนื้อหา (Body Sections):** Organize logically using `##` and `###` headers. Use horizontal rule dividers (`---`) to separate major sections.
4. **บทสรุป (Conclusion):** Re-anchor the discussion, highlight key takeaways, and leave the reader with a thought-provoking question.
5. **โบนัส (Bonus):** (Optional) Add extra context or interesting side notes.
6. **แหล่งอ้างอิง (References):** List all references at the bottom using `## แหล่งอ้างอิง` or `## อ้างอิง`.

### 4.2 MDX Integration

- **Figure Component:**
  ```mdx
  <Figure
    src="https://path_to_image"
    alt="Alt text in English"
    caption="คำอธิบายภาพภาษาไทยเพื่อช่วยอธิบายเนื้อหาหลัก"
  />
  ```
- **Callout Component:** Standardized tip/thank-you box at the end of the post.
  ```mdx
  <Callout type="tip" title="ขอบคุณที่อ่าน">
    📚 หวังว่าคุณจะสนุกกับการอ่าน!
  </Callout>
  ```
