# Debug Lab Log

This log covers the five bugs in the debug lab from shopboard-api.vercel.app/debug-lab. The fixes below are suggestions. I did not apply them to the exercise.

## Bug 1: Warning about list keys

**What I saw:** When I opened the Console on the exercise page, there was a warning that each item in a list should have a unique `key`.

**Where it was:** In the `CategoryChips` component.

**How I found it:** I read the warning, and the component name was written in it.

**Cause and fix:** The categories are rendered as a list without keys. The fix is to give each category a stable key that makes it different from the others. The category name itself can be the key, because the list is built with `new Set`, so each name is unique.

## Bug 2: A "0" in the wrong place

**What I saw:** There was a `0` under the products that were out of stock, and also inside the cart when it was empty.

**Where it was:** In `StockNote` and `CartPanel`.

**How I found it:** I looked at the products whose add button was disabled, and I noticed the zero in the cart before I added any product.

**Cause and fix:** The condition used with `&&` returns the number zero, and React renders it. The fix is to make the condition clear. In `StockNote`, check whether the stock is greater than zero. In `CartPanel`, use a separate check such as `cart.length > 0`.

## Bug 3: The heart moved to another product

**What I saw:** I clicked the heart on Leather Tote Bag. After I sorted the products by price from low to high, the heart was on Wool Scarf.

**Where it was:** In `ProductList` and `ProductCard`.

**How I found it:** I followed the product I had chosen before and after sorting.

**Cause and fix:** The code uses the product's position in the list as the key. The heart state (`saved`) is stored inside `ProductCard`, so it stays with the card that has the same key. When the order changed, the heart stayed in the same position instead of staying with the product. The fix is to use `product.id` as the key.

## Bug 4: The original order did not come back

**What I saw:** I switched the sort back to Featured, but the products did not return to their first order, and Wool Scarf stayed first.

**Where it was:** In `ProductList`.

**How I found it:** I sorted by price, then went back to Featured without refreshing the page.

**Cause and fix:** `sort()` changed the original products array itself. The fix is to make a copy of the array and sort the copy.

## Bug 5: The quantity is updated the wrong way

**What I saw:** I increased the quantity of the bag, and the numbers and the total were correct. I also compared `qty` in React DevTools with the quantity on the screen, and they matched. This bug did not show any visible problem in my test.

**Where it was:** In `CartRow` and the cart update inside `App`.

**How I found it:** Since I did not see a problem on the screen, I asked Claude to review the source and explain the issue.

**Cause and fix:** The code changes `item.qty` directly, then passes the same array back to `setCart`. Because of this, React might not re-render. The fix is for the component to ask its parent for the change, and for the parent to update the cart with a new array and a new item object.

## AI use

I tried the steps myself. I used ChatGPT to help me understand the results and organize my writing. I used Claude to review the source code for bug 5, to check my draft for all five bugs against the source code, to suggest the three clarifications for bugs 1, 2 and 3, and to translate my Arabic draft into English. The fixes are suggestions, and I did not apply them to the exercise.
