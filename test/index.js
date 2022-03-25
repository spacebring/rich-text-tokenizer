import { expect } from "chai";
import { parseMarkdown } from "../src";

describe("parseMarkdown", () => {
  it("should return parsed email in bold text", () => {
    expect(parseMarkdown(`**rk@andcards.com**`)).is.deep.equal([
      { type: "bold", children: [{ href: "rk@andcards.com", type: "email", value: "rk@andcards.com" }] },
    ]);
  });
  it("should return parsed link", () => {
    expect(parseMarkdown(`[rich links](https://www.andcards.com/) :)`)).is.deep.equal([
      { type: "link", href: "https://www.andcards.com/", value: "rich links" },
      { type: "text", value: " :)" },
    ]);
    expect(parseMarkdown(`__[anchor](https://www.facebook.com)__`)).is.deep.equal([
      { children: [{ type: "link", href: "https://www.facebook.com", value: "anchor" }], type: "bold" },
    ]);
    expect(parseMarkdown(`~~[anchor](https://www.facebook.com)~~`)).is.deep.equal([
      { children: [{ type: "link", href: "https://www.facebook.com", value: "anchor" }], type: "strikethrough" },
    ]);
  });
  it("should return parsed image", () => {
    expect(parseMarkdown(`![rich links](https://www.andcards.com/) :)`)).is.deep.equal([
      { type: "image", href: "https://www.andcards.com/", value: "rich links" },
      { type: "text", value: " :)" },
    ]);
    expect(parseMarkdown(`![](https://www.andcards.com/) :)`)).is.deep.equal([
      { type: "image", href: "https://www.andcards.com/", value: "" },
      { type: "text", value: " :)" },
    ]);
    expect(parseMarkdown(`__![anchor](https://www.facebook.com)__`)).is.deep.equal([
      { children: [{ type: "image", href: "https://www.facebook.com", value: "anchor" }], type: "bold" },
    ]);
    expect(parseMarkdown(`~~![anchor](https://www.facebook.com)~~`)).is.deep.equal([
      { children: [{ type: "image", href: "https://www.facebook.com", value: "anchor" }], type: "strikethrough" },
    ]);
  });
  it("should return parsed hashtags and mentions", () => {
    expect(parseMarkdown(`#first_hash #second_hash`)).is.deep.equal([
      { type: "hashtag", hashtag: "first_hash", value: "#first_hash" },
      { type: "text", value: " " },
      { type: "hashtag", hashtag: "second_hash", value: "#second_hash" },
    ]);
    expect(parseMarkdown(`#first*hash #second*hash @mention*bold ~~strikethrough~~`)).is.deep.equal([
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
    expect(
      parseMarkdown(
        "#residents\nЦікавий матеріал та чудова нагода познайомитися ближче з andcards: https://www.andcards.com"
      )
    ).is.deep.equal([
      { hashtag: "residents", type: "hashtag", value: "#residents" },
      {
        type: "text",
        value: "\nЦікавий матеріал та чудова нагода познайомитися ближче з andcards: ",
      },
      { href: "https://www.andcards.com", type: "link", value: "https://www.andcards.com" },
    ]);
  });
  it("should return parsed markdown tokens", () => {
    expect(
      parseMarkdown(
        "Вечір п'ятниці для відвертих тем і міцних жартів. Приходьте на [Пристойний Стндап](https://www.facebook.com/events/656828768259069/?acontext=%7B%22event_action_history%22%3A[%7B%22mechanism%22%3A%22search_results%22%2C%22surface%22%3A%22search%22%7D]%7D) відсвяткувати кінець робочого тижня💪🏼"
      )
    ).is.deep.equal([
      {
        type: "text",
        value: "Вечір п'ятниці для відвертих тем і міцних жартів. Приходьте на ",
      },
      {
        href:
          "https://www.facebook.com/events/656828768259069/?acontext=%7B%22event_action_history%22%3A[%7B%22mechanism%22%3A%22search_results%22%2C%22surface%22%3A%22search%22%7D]%7D",
        type: "link",
        value: "Пристойний Стндап",
      },
      { type: "text", value: " відсвяткувати кінець робочого тижня💪🏼" },
    ]);
    expect(
      parseMarkdown(
        "Вечір п'ятниці для відвертих тем і міцних жартів. Приходьте на ![Пристойний Стндап](https://www.facebook.com/events/656828768259069/?acontext=%7B%22event_action_history%22%3A[%7B%22mechanism%22%3A%22search_results%22%2C%22surface%22%3A%22search%22%7D]%7D) відсвяткувати кінець робочого тижня💪🏼"
      )
    ).is.deep.equal([
      {
        type: "text",
        value: "Вечір п'ятниці для відвертих тем і міцних жартів. Приходьте на ",
      },
      {
        href:
          "https://www.facebook.com/events/656828768259069/?acontext=%7B%22event_action_history%22%3A[%7B%22mechanism%22%3A%22search_results%22%2C%22surface%22%3A%22search%22%7D]%7D",
        type: "image",
        value: "Пристойний Стндап",
      },
      { type: "text", value: " відсвяткувати кінець робочого тижня💪🏼" },
    ]);
    expect(
      parseMarkdown(
        "Вечір п'ятниці для відвертих тем і міцних жартів. Приходьте на ![](https://www.facebook.com/events/656828768259069/?acontext=%7B%22event_action_history%22%3A[%7B%22mechanism%22%3A%22search_results%22%2C%22surface%22%3A%22search%22%7D]%7D) відсвяткувати кінець робочого тижня💪🏼"
      )
    ).is.deep.equal([
      {
        type: "text",
        value: "Вечір п'ятниці для відвертих тем і міцних жартів. Приходьте на ",
      },
      {
        href:
          "https://www.facebook.com/events/656828768259069/?acontext=%7B%22event_action_history%22%3A[%7B%22mechanism%22%3A%22search_results%22%2C%22surface%22%3A%22search%22%7D]%7D",
        type: "image",
        value: "",
      },
      { type: "text", value: " відсвяткувати кінець робочого тижня💪🏼" },
    ]);
    expect(
      parseMarkdown(
        "Вечір п'ятниці для #відвертих тем і міцних жартів. Приходьте на [Пристойний #Стндап](https://www.facebook.com/events/656828768259069/?#hash) відсвяткувати кінець робочого тижня💪🏼"
      )
    ).is.deep.equal([
      { type: "text", value: "Вечір п'ятниці для " },
      { hashtag: "відвертих", type: "hashtag", value: "#відвертих" },
      { type: "text", value: " тем і міцних жартів. Приходьте на " },
      { href: "https://www.facebook.com/events/656828768259069/?#hash", type: "link", value: "Пристойний #Стндап" },
      { type: "text", value: " відсвяткувати кінець робочого тижня💪🏼" },
    ]);
    expect(parseMarkdown(`**_~~b i del~~_**`)).is.deep.equal([
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
    expect(parseMarkdown(`**_~~strikethrough~~ & asd_**`)).is.deep.equal([
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
    expect(parseMarkdown(`[**rich links**](https://www.andcards.com/) ::)`)).is.deep.equal([
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
    expect(
      parseMarkdown(
        `[https://www.facebook.com/events/656828768259069/?acontext=%7B%22event_action_history%22%3A[%7B%22mechanism%22%3A%22search_results%22%2C%22surface%22%3A%22search%22%7D]%7D](https://www.facebook.com/events/656828768259069/?acontext=%7B%22event_action_history%22%3A[%7B%22mechanism%22%3A%22search_results%22%2C%22surface%22%3A%22search%22%7D]%7D) ::)`
      )
    ).is.deep.equal([
      {
        type: "link",
        href:
          "https://www.facebook.com/events/656828768259069/?acontext=%7B%22event_action_history%22%3A[%7B%22mechanism%22%3A%22search_results%22%2C%22surface%22%3A%22search%22%7D]%7D",
        value:
          "https://www.facebook.com/events/656828768259069/?acontext=%7B%22event_action_history%22%3A[%7B%22mechanism%22%3A%22search_results%22%2C%22surface%22%3A%22search%22%7D]%7D",
      },
      { type: "text", value: " ::)" },
    ]);
    expect(
      parseMarkdown(
        `[](https://www.facebook.com/events/656828768259069/?acontext=%7B%22event_action_history%22%3A[%7B%22mechanism%22%3A%22search_results%22%2C%22surface%22%3A%22search%22%7D]%7D) ::)`
      )
    ).is.deep.equal([
      {
        type: "link",
        href:
          "https://www.facebook.com/events/656828768259069/?acontext=%7B%22event_action_history%22%3A[%7B%22mechanism%22%3A%22search_results%22%2C%22surface%22%3A%22search%22%7D]%7D",
        value: "",
      },
      { type: "text", value: " ::)" },
    ]);
  });
});
