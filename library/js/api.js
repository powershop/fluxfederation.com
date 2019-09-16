$(document).ready(function () {

	captcha_sitekey = '6Ld5v7cUAAAAANz28l09GqtI4KjKOuJcrwjn1HUD'

	talk_to_us_styles = {
		'#talk-to-us #input-2 p' : 'm-all t-1of3',
		'#talk-to-us #input-14' : 'news' ,
		'#talk-to-us textarea' : 'full-width'
	}

	drop_a_line_styles = {
		'.drop-us-a-line-container p' : 'm-all',
		'.drop-us-a-line-container p label' : 'm-all d-1of4',
		'.drop-us-a-line-container input, .drop-us-a-line-container textarea' : 'm-all t-3of4 cf',
		'.drop-us-a-line-container .flux-button-container' : 'm-all t-1of4 right cf'
	}

	if ($('#talk-to-us').length) {
		getFormData(1)
		.then(data => buildForm(data))
		.then(form => $('.talk-to-us-container').append(form))
		.then(() => addCustomCss(talk_to_us_styles))
		.catch(error => console.log(error))
	}

	if ($('.drop-us-a-line-container').length) {
		getFormData(2)
		.then(data => buildForm(data))
		.then(form => $('.drop-us-a-line-container').append(form))
		.then(() => addCustomCss(drop_a_line_styles))
		.catch(error => console.log(error))
	}



	addCustomCss = (styles) => {
		$.each(styles, (selector, classNames) => $(selector).addClass(classNames))
	}

	buildForm = data => {
		// captcha = shouldIncludeCaptcha(data.fields)
		captcha = false
	 	html = hiddenIdInput(data.id)
		$.each(data.fields, function (i,input) {
			html += createInput(input)
		})
		html += submitButton(data.button, data.id, captcha)
		return $(`<form id="${data.id}" enctype="text/plain"></form>`).append(html)
	}

	createInput = input => {
		switch(input.type) {
		case 'checkbox':
		case 'radio':
			return radioInput(input)
			break
		case 'html':
			return input.content
			break
		case 'text':
			return textInput(input)
			break
		case 'email':
			return textInput(input)
			break
		case 'textarea':
		  return textArea(input)
		case 'captcha':
		  return ''
		  break
		}
	}

	radioInput = input => {
		html = `<div class="radio-buttons" id="input-${input.id}" >`
		$.each(input.choices, function (i,v) {
			html += `<p><input id="${v.value}" type="${input.type}" name="${input.id}${input.type == 'checkbox' ? `.${i+1}` : ""}" value="${v.value}" ${(v.isSelected ? " checked" : "" )}><label for="${v.value}">${v.text}</label></p>`
		})
		html += '</div>'
		return html
	}

	captchaField = () => `<div class="g-recaptcha" data-sitekey="${captcha_sitekey}"></div>`

	textInput = input => `<p id="input-${input.id}">${label(input)}<input name="${input.id}" type="${input.type}" placeholder="${input.placeholder}"></p>`
	
	textArea = input => `<p id="input-${input.id}">${label(input)}<textarea name="${input.id}" placeholder="${input.placeholder}"></textarea></p>`

	label = input => `<label for="${input.id}">${input.label}</label>`

	hiddenIdInput = id => `<input id="${id}" type="hidden" value="${id}" name="form_id"></input>`

	submitButton = (button, id, captcha) => `<div class="flux-button-container"><div class="flux-button" id="${id}"><button data-sitekey="${captcha ? captcha_sitekey : '' }" class="${captcha ? 'g-recaptcha' : '' }" >${button.text}</button></div></div>`

	shouldIncludeCaptcha = fields => {
		for (var field of fields) {
		  if (field.type == 'captcha') { 
		  	return true
		  }
		}
	}

	addEntry = form => {
		data = formDataToJson($(form).serializeArray())
		postForm(data)
		.then(data => console.log(data))
		.catch(error => console.log(error))
	}

	formDataToJson = data => {
		json = {}
		$(data).each((i, v) => json[v.name] = v.value)
		return json
	}

	$('body').on('click', 'form .flux-button', (e) => {
		e.preventDefault()
		id = e.currentTarget.id
		allFieldsValid(id) ? $(`form#${id}`).submit() : ''
	})

	$('body').on('submit', 'form', e => {
		e.preventDefault()
		addEntry(e.currentTarget)
	})

	function getFormData(form_id) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: "https://fluxfederation.wpengine.com/wp-json/fluxapi/v1/form/" + form_id,
				crossDomain: true,
				success: function(data) {
					resolve(data)
				},
				error: function(error) {
					reject(error)
				}
			})
		})	
	}

	function postForm(data) {
		return new Promise((resolve, reject) => {
			$.ajax({
				url: "https://fluxfederation.wpengine.com/wp-json/fluxapi/v1/form/" + data.form_id,
				crossDomain: true,
				method: 'POST',
				dataType: "json",
				data: JSON.stringify(data),
				success: function(data) {
					resolve(data)
				},
				error: function(error) {
					reject(error)
				}
			})
		})
	}

	////////////////////////////////////////////////////////////////////////
	// Validations //
	////////////////////////////////////////////////////////////////////////

	talk_to_us_validations = {
		'1' : ['aboveMinLength', 'belowMaxLength', 'noNumbers'],
		'2' : ['isEmail'],
		'3' : ['aboveMinLength']
	}

	drop_a_line__validations = {
		'3' : ['aboveMinLength', 'belowMaxLength', 'noNumbers'],
		'4' : ['aboveMinLength', 'belowMaxLength'],
		'5' : ['aboveMinLength', 'belowMaxLength'],
		'6' : ['isEmail'],
		'9' : ['aboveMinLength']
	}


	getValidations = id => {
		switch(id) {
		case '1':
			return drop_a_line__validations
			break
		case '2':
			return talk_to_us_validations
			break
		}
	}

	runValidation = (val, validation) => {
		switch(validation) {
			case 'aboveMinLength':
				return aboveMinLength(val)
				break
			case 'belowMaxLength':
				return belowMaxLength(val)
				break;
			case 'isEmail':
				return isEmail(val)
				break
			case 'noNumbers':
				return noNumbers(val)
				break
		}
	}

	aboveMinLength = (val) => val.length >= 3

	belowMaxLength = (val) => val.length <= 30

	isEmail = val => /\S+@\S+\.\S+/.test(val)

	noNumbers = val => !/\d/.test(val)

	getFieldByName = (form_id, input_name) => $(`form#${form_id} *[name="${input_name}"]`)

	fieldIsValid = (val, validation) => runValidation(val, validation)

	getFieldValidation = (form_id, name) => getValidations(form_id)[name]

	addValidationClass = (input, valid) => valid ? input.removeClass('error').addClass('valid') : input.removeClass('valid').addClass('error')

	allFieldsValid = form_id => {
		valid = true
		validations = getValidations(form_id)
		for (var name in validations) {
			field_validations = validations[name]
			value = getFieldByName(form_id, name).val()
			for (validation of field_validations) {
				fieldIsValid(value, validation) ? '' : valid = false
			}
		}
		return valid
	}

	$('body').on('blur', 'input, textarea', (e) => {
		valid = true
		name = e.currentTarget.name
		form_id = e.currentTarget.form.id
		validations = getFieldValidation(form_id, name)
		value = getFieldByName(form_id, name).val()
		for (validation of validations) {
			console.log(`${value} : ${validation} : ${runValidation(value, validation)}`)
			runValidation(value, validation) ? '' : valid = false
		}
		addValidationClass(getFieldByName(form_id, name), valid)
	})



})



