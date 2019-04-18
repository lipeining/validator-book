
const href_name1 =`2
<p><a href="http://www.quackit.com/html/tutorial/html_links.cfm">Example Link</a></p>
<div class="more-info"><a href="http://www.quackit.com/html/examples/html_links_examples.cfm">More Link Examples...</a></div>`;

const href_name2 = `13
<div class="portal" role="navigation" id='p-navigation'>
<h3>Navigation</h3>
<div class="body">
<ul>
 <li id="n-mainpage-description"><a href="/wiki/Main_Page" title="Visit the main page [z]" accesskey="z">Main page</a></li>
 <li id="n-contents"><a href="/wiki/Portal:Contents" title="Guides to browsing Wikipedia">Contents</a></li>
 <li id="n-featuredcontent"><a href="/wiki/Portal:Featured_content" title="Featured content  the best of Wikipedia">Featured content</a></li>
<li id="n-currentevents"><a href="/wiki/Portal:Current_events" title="Find background information on current events">Current events</a></li>
<li id="n-randompage"><a href="/wiki/Special:Random" title="Load a random article [x]" accesskey="x">Random article</a></li>
<li id="n-sitesupport"><a href="//donate.wikimedia.org/wiki/Special:FundraiserRedirector?utm_source=donate&utm_medium=sidebar&utm_campaign=C13_en.wikipedia.org&uselang=en" title="Support us">Donate to Wikipedia</a></li>
</ul>
</div>
</div> `;

// http://www.quackit.com/html/tutorial/html_links.cfm,Example Link
// http://www.quackit.com/html/examples/html_links_examples.cfm,More Link Examples...

// /wiki/Main_Page,Main page
// /wiki/Portal:Contents,Contents
// /wiki/Portal:Featured_content,Featured content
// /wiki/Portal:Current_events,Current events
// /wiki/Special:Random,Random article
// //donate.wikimedia.org/wiki/Special:FundraiserRedirector?utm_source=donate&utm_medium=sidebar&utm_campaign=C13_en.wikipedia.org&uselang=en,Donate to Wikipedia 
const href_reg = /href="([^"]*)"/g;
const name_reg = /<a[^>]*>(.*)<\/a>/g;
// console.log(href_reg[Symbol.search](href_name1));
// console.log(href_name1.match(href_reg));
// console.log(href_name1.match(name_reg));

const combine_reg = /<a href="([^"]*)"[^>]*>(.*)<\/a>/g;
// console.log(combine_reg.exec(href_name1));
let myArray;
// while ((myArray = combine_reg.exec(href_name1)) !== null) {
//     const  msg = `${myArray[1]},${myArray[2]}`;
//     console.log(msg);
//   }
// while ((myArray = combine_reg.exec(href_name2)) !== null) {
//     const  msg = `${myArray[1]},${myArray[2]}`;
//     console.log(msg);
//   }

  // const tag_reg = /<\s*(\w+)\s*[^>]*>/g; // here it works
  const tag_reg = /<\s*(\w+)\s*[^>]*>.*<\s*\/\1\s*>/g; // here it doesn't work
  while ((myArray = tag_reg.exec(href_name1)) !== null) {
    const  msg = `${myArray[1]},${myArray[2]}`;
    console.log(myArray);
  }
//   input = input.split('\n').slice(1).join('');
// 	var r = /<\s*a\s*href=['"]([^'"]+)['"][^>]*>\s*(.*?)\s*(?=<\s*\/\s*a>)<\s*\/\s*a>/ig;
// 	var url = new Array(), title = new Array();
// 	input = input.match(r);
// 	for (i=0, j=input.length; i<j; i+=1) {
// 		url[i] = input[i].replace(r, '$1');
// 		title[i] = input[i].replace(r, '$2');
// 		var tmp = title[i].match(/(?:<[^>]+>)*((?!<))/ig);
// 		for (ii=0, jj=tmp.length; ii<jj; ii+=1) {
// 			if (tmp[ii] !== '') {
// 				title[i] = title[i].replace(tmp[ii], '');
// 			}
// 		}
// 		console.log(url[i]+','+title[i]);
//     }
    