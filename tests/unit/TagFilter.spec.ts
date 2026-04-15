import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import TagFilter from "@/components/TagFilter.vue";

describe("TagFilter", () => {
  it("emits model updates when chips are clicked", async () => {
    const w = mount(TagFilter, {
      props: { tags: ["work", "home"] },
    });
    await w.get('[data-testid="tag-filter-work"]').trigger("click");
    expect(w.emitted("update:modelValue")?.[0]).toEqual(["work"]);
    await w.get('[data-testid="tag-filter-all"]').trigger("click");
    const emits = w.emitted("update:modelValue");
    expect(emits?.[emits.length - 1]).toEqual([null]);
  });
});
