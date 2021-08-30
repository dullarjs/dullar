/*
 * @Author: Just be free
 * @Date:   2020-06-04 14:16:18
 * @Last Modified by:   Just be free
 * @Last Modified time: 2020-06-04 14:51:58
 * @E-mail: justbefree@126.com
 */

import { mount } from "@vue/test-utils";
import Flex from "@/flex/flex";

describe("Flex", () => {
  it("renders the correct markup", () => {
    const wrapper = mount(Flex, {
      propsData: {
        justifyContent: "spaceAround",
      },
    });
    expect(wrapper.props("justifyContent")).toBe("spaceAround");
    expect(wrapper.html()).toContain(
      '<div class="yn-flex yn-justify-content-space-around"></div>'
    );
    wrapper.setProps({ flexDirection: "rowReverse" });
    expect(wrapper.vm.flexDirection).toBe("rowReverse");
    expect(wrapper.classes("yn-justify-content-space-around")).toBe(true);
  });
});
