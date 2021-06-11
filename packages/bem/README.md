# @dullar/bem

## Installation

```
npm install @dullar/bem --save
```

## Usage

```
import BEM, { createBem } from "awesome-scss-bem";

BEM.confit(options);

createBem(options);

```

## Examples

```

BEM.config({
  blockPrefix: "bem-", // block的前缀
  modifierSeparator: "--", // 状态连接符
  elementSeparator: "__" // 元素连接符
});

createBem("block"); => block

createBem("block", "element"); => block__element

createBem({ block: "green" }); => block--green

createBem("block", { element: "active" }); => block__element block__element--active

createBem("block", { element: { "is-active": true } }); => block__element block__element--is-active

createBem("block", { element: { "is-active": false } }); => block__element

createBem("block", { element: { "has-color": "black" } }); => block__element block__element--has-color--black

createBem({ block: "active" }, { element: "active" }); => block__element block__element--active

createBem({ block: { "is-show": true } }); => block block--is-show

createBem({ block: { "is-show": false } }); => block

```

## Links
 - [BEM](https://lizhuang.xyz/youdefine-docs/bem/)