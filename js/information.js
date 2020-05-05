function start()
{
	// jQuery('.switcher').on('click', e => {
	// 	jQuery(e.currentTarget.parentElement).toggleClass('close');
	// });

	jQuery('.switcher,.name').on('click', e => {
		console.log(e);
		jQuery(e.currentTarget.parentElement).toggleClass('close');
	});
}

window.addEventListener("load", start, false);