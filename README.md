Match height directive
=====================

[All Credits Go To eatinabit - https://www.npmjs.com/package/angular-same-height](https://www.npmjs.com/package/angular-match-height)
An Angular directive that keeps elements at the same height. With updated scope broadcasting.

(This directive does not work in IE <= 8.)

How to install
--------------

	npm install angular-match-height --save


How to use
----------

Format:

	match-height="MEDIA QUERY { SELECTOR } [, MEDIA QUERY { SELECTOR } ]"

If `MEDIA QUERY` is `*`, the elements found by `SELECTOR` are always kept at the same height.

Examples:

	<article match-height="(min-width: 901px) { h2 } screen and (min-width: 901px) { div p:nth-of-type(1) }">
		<div>
			<h1>Title 1</h1>
			<p>Paragraph 1</p>
		</div>

		<div>
			<h1>Title 2 <br /> Title 2</h1>
			<p>Paragraph 2 <br /> Paragraph 2</p>
			<p>Paragraph 3 (not kept the same height)</p>
		</div>
	</article>

	<ul match-height="* { li }">
		<li>Text</li>
		<li>Text<br />Text</li>
		<li>Text<br />Text<br />Text</li>
	</ul>