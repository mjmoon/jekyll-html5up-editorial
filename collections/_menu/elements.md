---
title: Elements
layout: page
---
{% include sample_elements/00-content.html %}
<hr class="major" />

<!-- Elements -->
<h2 id="elements">Elements</h2>
<div class="row 200%">
	<div class="6u 12u$(medium)">
		<!-- Text stuff -->
		{% include sample_elements/01-text.html %}

		<!-- Lists -->
		{% include sample_elements/02-lists.html %}

		<!-- Blockquote -->
		{% include sample_elements/03-blockquote.html %}

		<!-- Table -->
		{% include sample_elements/04-table.html %}
	</div>
	<div class="6u$ 12u$(medium)">
		<!-- Buttons -->
		{% include sample_elements/05-button.html %}

		<!-- Form -->
		{% include sample_elements/06-form.html %}

		<!-- Image -->
		{% include sample_elements/07-image.html %}

		<!-- Box -->
		{% include sample_elements/08-box.html %}

		<!-- Preformatted Code -->
		{% include sample_elements/09-code.html %}
	</div>
</div>

#### Syntax highlighter only works with markdown
```c
i = 0;

while (!deck.isInOrder()) {
print "Iteration " + i;
deck.shuffle();
i++;
}

print "It took " + i + " iterations to sort the deck."";
```
