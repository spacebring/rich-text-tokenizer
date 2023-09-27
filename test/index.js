import assert from "assert";
import { parseMarkdown } from "../src/index.js";

describe("parseMarkdown", () => {
  it("should not crash when no string", () => {
    assert.deepEqual(parseMarkdown(), []);
    assert.deepEqual(parseMarkdown(["Text", { foo: "bar" }]), [{ type: "text", value: "Text,[object Object]" }]);
  });
  it("should not return parsed phone number", () => {
    assert.deepEqual(parseMarkdown("bla bla\n\nGE69TB7916245061200010"), [
      { type: "text", value: "bla bla\n\nGE69TB7916245061200010" },
    ]);
  });
  it("should return parsed phone number", () => {
    assert.deepEqual(parseMarkdown(`Here is my number: +380976328791 and +380 44 334 1234 :)`), [
      { type: "text", value: "Here is my number: " },
      { href: "+380976328791", type: "phone", value: "+380976328791" },
      { type: "text", value: " and " },
      { href: "+380 44 334 1234", type: "phone", value: "+380 44 334 1234" },
      { type: "text", value: " :)" },
    ]);
    assert.deepEqual(
      parseMarkdown(
        `Деталі у адміністратора +38 (097) 123 45 56. У випадку. 25. Можна запросити з собою кого вважаєте за потрібне.`,
      ),
      [
        { type: "text", value: "Деталі у адміністратора " },
        { href: "+38 (097) 123 45 56", type: "phone", value: "+38 (097) 123 45 56" },
        { type: "text", value: ". У випадку. 25. Можна запросити з собою кого вважаєте за потрібне." },
      ],
    );
  });
  it("should return parsed email in bold text", () => {
    assert.deepEqual(parseMarkdown(`**rk@andcards.com**`), [
      { type: "bold", children: [{ href: "rk@andcards.com", type: "email", value: "rk@andcards.com" }] },
    ]);
  });
  it("should return parsed link", () => {
    assert.deepEqual(parseMarkdown(`[rich links](https://www.andcards.com/) :)`), [
      { type: "link", href: "https://www.andcards.com/", value: "rich links" },
      { type: "text", value: " :)" },
    ]);
    assert.deepEqual(parseMarkdown(`__[anchor](https://www.facebook.com)__`), [
      { children: [{ type: "link", href: "https://www.facebook.com", value: "anchor" }], type: "bold" },
    ]);
    assert.deepEqual(parseMarkdown(`~~[anchor](https://www.facebook.com)~~`), [
      { children: [{ type: "link", href: "https://www.facebook.com", value: "anchor" }], type: "strikethrough" },
    ]);
  });
  it("should return parsed image", () => {
    assert.deepEqual(parseMarkdown(`![rich links](https://www.andcards.com/) :)`), [
      { type: "image", href: "https://www.andcards.com/", value: "rich links" },
      { type: "text", value: " :)" },
    ]);
    assert.deepEqual(parseMarkdown(`![](https://www.andcards.com/) :)`), [
      { type: "image", href: "https://www.andcards.com/", value: "" },
      { type: "text", value: " :)" },
    ]);
    assert.deepEqual(parseMarkdown(`__![anchor](https://www.facebook.com)__`), [
      { children: [{ type: "image", href: "https://www.facebook.com", value: "anchor" }], type: "bold" },
    ]);
    assert.deepEqual(parseMarkdown(`~~![anchor](https://www.facebook.com)~~`), [
      { children: [{ type: "image", href: "https://www.facebook.com", value: "anchor" }], type: "strikethrough" },
    ]);
  });
  it("should return parsed hashtags and mentions", () => {
    assert.deepEqual(parseMarkdown(`#first_hash #second_hash`), [
      { type: "hashtag", hashtag: "first_hash", value: "#first_hash" },
      { type: "text", value: " " },
      { type: "hashtag", hashtag: "second_hash", value: "#second_hash" },
    ]);
    assert.deepEqual(parseMarkdown(`#first*hash #second*hash @mention*bold ~~strikethrough~~`), [
      { type: "hashtag", hashtag: "first*hash", value: "#first*hash" },
      { type: "text", value: " " },
      { type: "hashtag", hashtag: "second*hash", value: "#second*hash" },
      { type: "text", value: " " },
      { type: "mention", mention: "mention", value: "@mention" },
      { type: "text", value: "*bold " },
      {
        children: [{ type: "text", value: "strikethrough" }],
        type: "strikethrough",
      },
    ]);
    assert.deepEqual(
      parseMarkdown(
        "#residents\nЦікавий матеріал та чудова нагода познайомитися ближче з andcards: https://www.andcards.com",
      ),
      [
        { hashtag: "residents", type: "hashtag", value: "#residents" },
        {
          type: "text",
          value: "\nЦікавий матеріал та чудова нагода познайомитися ближче з andcards: ",
        },
        { href: "https://www.andcards.com", type: "link", value: "https://www.andcards.com" },
      ],
    );
  });
  it("should return parsed markdown tokens", () => {
    assert.deepEqual(
      parseMarkdown(
        "Вечір п'ятниці для відвертих тем і міцних жартів. Приходьте на [Пристойний Стндап](https://www.facebook.com/events/656828768259069/?acontext=%7B%22event_action_history%22%3A[%7B%22mechanism%22%3A%22search_results%22%2C%22surface%22%3A%22search%22%7D]%7D) відсвяткувати кінець робочого тижня💪🏼",
      ),
      [
        {
          type: "text",
          value: "Вечір п'ятниці для відвертих тем і міцних жартів. Приходьте на ",
        },
        {
          href: "https://www.facebook.com/events/656828768259069/?acontext=%7B%22event_action_history%22%3A[%7B%22mechanism%22%3A%22search_results%22%2C%22surface%22%3A%22search%22%7D]%7D",
          type: "link",
          value: "Пристойний Стндап",
        },
        { type: "text", value: " відсвяткувати кінець робочого тижня💪🏼" },
      ],
    );
    assert.deepEqual(
      parseMarkdown(
        "Вечір п'ятниці для відвертих тем і міцних жартів. Приходьте на ![Пристойний Стндап](https://www.facebook.com/events/656828768259069/?acontext=%7B%22event_action_history%22%3A[%7B%22mechanism%22%3A%22search_results%22%2C%22surface%22%3A%22search%22%7D]%7D) відсвяткувати кінець робочого тижня💪🏼",
      ),
      [
        {
          type: "text",
          value: "Вечір п'ятниці для відвертих тем і міцних жартів. Приходьте на ",
        },
        {
          href: "https://www.facebook.com/events/656828768259069/?acontext=%7B%22event_action_history%22%3A[%7B%22mechanism%22%3A%22search_results%22%2C%22surface%22%3A%22search%22%7D]%7D",
          type: "image",
          value: "Пристойний Стндап",
        },
        { type: "text", value: " відсвяткувати кінець робочого тижня💪🏼" },
      ],
    );
    assert.deepEqual(
      parseMarkdown(
        "Вечір п'ятниці для відвертих тем і міцних жартів. Приходьте на ![](https://www.facebook.com/events/656828768259069/?acontext=%7B%22event_action_history%22%3A[%7B%22mechanism%22%3A%22search_results%22%2C%22surface%22%3A%22search%22%7D]%7D) відсвяткувати кінець робочого тижня💪🏼",
      ),
      [
        {
          type: "text",
          value: "Вечір п'ятниці для відвертих тем і міцних жартів. Приходьте на ",
        },
        {
          href: "https://www.facebook.com/events/656828768259069/?acontext=%7B%22event_action_history%22%3A[%7B%22mechanism%22%3A%22search_results%22%2C%22surface%22%3A%22search%22%7D]%7D",
          type: "image",
          value: "",
        },
        { type: "text", value: " відсвяткувати кінець робочого тижня💪🏼" },
      ],
    );
    assert.deepEqual(
      parseMarkdown(
        "Вечір п'ятниці для #відвертих тем і міцних жартів. Приходьте на [Пристойний #Стндап](https://www.facebook.com/events/656828768259069/?#hash) відсвяткувати кінець робочого тижня💪🏼",
      ),
      [
        { type: "text", value: "Вечір п'ятниці для " },
        { hashtag: "відвертих", type: "hashtag", value: "#відвертих" },
        { type: "text", value: " тем і міцних жартів. Приходьте на " },
        { href: "https://www.facebook.com/events/656828768259069/?#hash", type: "link", value: "Пристойний #Стндап" },
        { type: "text", value: " відсвяткувати кінець робочого тижня💪🏼" },
      ],
    );
    assert.deepEqual(parseMarkdown(`**_~~b i del~~_**`), [
      {
        children: [
          {
            children: [
              {
                children: [{ type: "text", value: "b i del" }],
                type: "strikethrough",
              },
            ],
            type: "italic",
          },
        ],
        type: "bold",
      },
    ]);
    assert.deepEqual(parseMarkdown(`**_~~strikethrough~~ & asd_**`), [
      {
        children: [
          {
            children: [
              {
                children: [{ type: "text", value: "strikethrough" }],
                type: "strikethrough",
              },
              { type: "text", value: " & asd" },
            ],
            type: "italic",
          },
        ],
        type: "bold",
      },
    ]);
    assert.deepEqual(parseMarkdown(`[**rich links**](https://www.andcards.com/) ::)`), [
      {
        type: "link",
        href: "https://www.andcards.com/",
        children: [
          {
            type: "bold",
            children: [{ type: "text", value: "rich links" }],
          },
        ],
      },
      { type: "text", value: " ::)" },
    ]);
    assert.deepEqual(
      parseMarkdown(
        `[https://www.facebook.com/events/656828768259069/?acontext=%7B%22event_action_history%22%3A[%7B%22mechanism%22%3A%22search_results%22%2C%22surface%22%3A%22search%22%7D]%7D](https://www.facebook.com/events/656828768259069/?acontext=%7B%22event_action_history%22%3A[%7B%22mechanism%22%3A%22search_results%22%2C%22surface%22%3A%22search%22%7D]%7D) ::)`,
      ),
      [
        {
          type: "link",
          href: "https://www.facebook.com/events/656828768259069/?acontext=%7B%22event_action_history%22%3A[%7B%22mechanism%22%3A%22search_results%22%2C%22surface%22%3A%22search%22%7D]%7D",
          value:
            "https://www.facebook.com/events/656828768259069/?acontext=%7B%22event_action_history%22%3A[%7B%22mechanism%22%3A%22search_results%22%2C%22surface%22%3A%22search%22%7D]%7D",
        },
        { type: "text", value: " ::)" },
      ],
    );
    assert.deepEqual(
      parseMarkdown(
        `[](https://www.facebook.com/events/656828768259069/?acontext=%7B%22event_action_history%22%3A[%7B%22mechanism%22%3A%22search_results%22%2C%22surface%22%3A%22search%22%7D]%7D) ::)`,
      ),
      [
        {
          type: "link",
          href: "https://www.facebook.com/events/656828768259069/?acontext=%7B%22event_action_history%22%3A[%7B%22mechanism%22%3A%22search_results%22%2C%22surface%22%3A%22search%22%7D]%7D",
          value: "",
        },
        { type: "text", value: " ::)" },
      ],
    );
    assert.deepEqual(
      parseMarkdown("Забронювати та оплатити місце можна через застосунок - https://k15.andcards.com."),
      [
        { type: "text", value: "Забронювати та оплатити місце можна через застосунок - " },
        { type: "link", href: "https://k15.andcards.com", value: "https://k15.andcards.com" },
        { type: "text", value: "." },
      ],
    );
  });
});
