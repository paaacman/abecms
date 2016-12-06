import sourceAutocomplete   from './sourceAutocomplete'
import sourceOption   from './sourceOption'
import {
  abeExtend
  ,User
} from '../../../'

export function getAttributes(params) {
  var attributes = ''
  if(params.key != null) attributes += `id="${params.key}" data-id="${params.key}"`
  if(params.value != null) attributes += ` value="${params.value}"`
  if(params['max-length'] != null) attributes += ` maxlength="${params['max-length']}" data-maxlength="${params['max-length']}"`
  if(params.reload != null) attributes += ` reload="${params.reload}"`
  if(params.order != null) attributes += ` tabIndex="${params.order}"`
  if(params.required != null) attributes += ` data-required="${params.required}"`
  if(params.display != null) attributes += ` data-display="${params.display}"`
  if(params.visible != null) attributes += ` data-visible="${params.visible}"`
  if(params.autocomplete != null) attributes += ` data-autocomplete="${params.autocomplete}"`
  if(params.placeholder != null) attributes += ` placeholder="${params.placeholder}"`
  if(params.thumbs != null) attributes += ` data-size="${params.thumbs}"`
  if(params.toolbar != null) attributes += ` data-toolbar="${params.toolbar}"`
  if(params.multiple != null) attributes += ` ${params.multiple}`
  if(params.disabled != null) attributes += ` ${params.disabled}`
  return attributes
}

export function getLabel(params) {
  var desc = params.desc + ((params.required) ? ' *' : '')
  return `<label class="control-label" for="${params.key}" >
            ${desc}
          </label>`
}

export function createInputSource(attributes, inputClass, params) {
  var inputSource = ''
  var lastValues
  if(params.autocomplete != null && params.autocomplete === 'true') {
    if(params.sourceString.indexOf('http') === 0) lastValues = params.source
    else lastValues = JSON.stringify(params.source).replace(/\'/g, '&quote;')
    inputSource += '<div class="autocomplete-result-wrapper">'
    if(params.autocomplete != null && params.autocomplete === 'true' && params.prefill === 'true') {
      inputSource += `<div  class="autocomplete-refresh" value=''
                            data-autocomplete-refresh="true"
                            data-autocomplete-refresh-sourcestring="${params.sourceString}"
                            data-autocomplete-refresh-prefill-quantity="${params['prefill-quantity']}"
                            data-autocomplete-refresh-key="${params.key}"
                            data-autocomplete-data-display="${params.display}" >
                        <span class="glyphicon glyphicon-refresh"></span>
                      </div>`
    }
    Array.prototype.forEach.call(params.value, (val) => {
      inputSource += sourceAutocomplete(val, params)
    })
    inputSource += `</div><input value="" type="text" autocomplete="off" data-value='${lastValues}' ${attributes} class="${inputClass}" />`
  }
  else {
    lastValues = JSON.stringify(params.value).replace(/\'/g, '&quote;')
    inputSource += `<select ${attributes} class="${inputClass}" last-values='${lastValues}'>`

    if (!params.required) inputSource += '<option value=\'\'></option>'
    if(typeof params.source === 'object' && Object.prototype.toString.call(params.source) === '[object Array]') {
      Array.prototype.forEach.call(params.source, (val) => {
        inputSource += sourceOption(val, params)
      })
    }
    else inputSource += sourceOption(params.source, params)
    inputSource += '</select>'
  }
  return inputSource
}

export function createInputRich(attributes, inputClass, params) {
  var buttons = [
    { icon: "bold",                  title: "Bold (Ctrl+B)",       action: "bold",         param: "",         hotkey: "b" },
    { icon: "italic",                title: "Italic (Ctrl+I)",     action: "italic",       param: "",         hotkey: "i" },
    { icon: "underline",             title: "Underline (Ctrl+U)",  action: "underline",    param: "",         hotkey: "u" },
    { icon: "text-color",            title: "Text color",          action: "forecolor",    param: "",         popup: "color" },
    { icon: "text-background",       title: "Background color",    action: "highlight",    param: "",         popup: "color" },
    { icon: "object-align-left",     title: "Left",                action: "align",        param: "left" },
    { icon: "object-align-vertical", title: "Center",              action: "align",        param: "center" },
    { icon: "object-align-right",    title: "Right",               action: "align",        param: "right" },
    { icon: "menu-hamburger",        title: "Justify",             action: "align",        param: "justify" },
    { icon: "subscript",             title: "Subscript",           action: "subscript",    param: "" },
    { icon: "superscript",           title: "Superscript",         action: "superscript",  param: "" },
    { icon: "triangle-right",        title: "Indent",              action: "indent",       param: "" },
    { icon: "triangle-left",         title: "Outdent",             action: "indent",       param: "outdent" },
    { icon: "th-list",               title: "Unordered list",      action: "insertList",   param: "" },
    { icon: "remove",                title: "Remove format",       action: "removeFormat", param: "" },
    { icon: "link",                  title: "Add link",            action: "insertLink",   param: "",         popup: "link" },
    { icon: "console",               title: "Code style",          action: "code",         param: "" }
  ];
  if(params.toolbar !== '*') params.toolbar = params.toolbar.split(',')
  var inputRich = `<div class="wysiwyg-container rich">
                    <div class="wysiwyg-toolbar wysiwyg-toolbar-top">`

  buttons.forEach(function (button) {
    if(params.toolbar === '*' || params.toolbar.indexOf(button.action) > -1){
      var hotkey = (button.hotkey != null) ? `hotkey="${button.hotkey}"` : ''
      var popup = (button.popup != null) ? `data-popup="${button.popup}"` : ''
      var icon = (button.icon !== 'underline') ? `glyphicon-${button.icon}` : button.icon
      inputRich += `<a  class="wysiwyg-toolbar-icon" 
                        data-action="${button.action}"
                        data-param="${button.param}"
                        title="${button.title}"
                        ${hotkey}
                        ${popup}
                        href="#">
                      <span class="glyphicon ${icon}"></span>
                    </a>`
    }
  })

  inputRich +=    `</div>
                  <textarea class="${inputClass} form-rich" ${attributes} rows="4">${params.value}</textarea>
                </div>`

  return inputRich
}

export function createInputFile(attributes, inputClass, params) {
  return `<input class="form-control" ${attributes} name="${params.key}" type="file" />
          <span class="percent"></span>
          <input type="text" ${attributes} class="${inputClass} hidden" />`
}

export function createInputTextarea(attributes, inputClass, params) {
  return `<textarea class="${inputClass}" ${attributes} rows="4">${params.value}</textarea>`
}

export function createInputLink(attributes, inputClass, params) {
  return `<div class="input-group">
            <div class="input-group-addon link">
              <span class="glyphicon glyphicon-link" aria-hidden="true"></span>
            </div>
            <input type="text" ${attributes} class="${inputClass}" />
          </div>`
}

export function createInputImage(attributes, inputClass, params) {
  return `<div class="input-group img-upload">
            <div class="input-group-addon image">
              <span class="glyphicon glyphicon-picture" aria-hidden="true"></span>
            </div>
            <input type="text" ${attributes} class="${inputClass} image-input" />
            <div class="upload-wrapper">
              <input class="form-control" ${attributes} name="${params.key}" type="file" title="upload an image"/>
              <span class="percent">
                <span class="glyphicon glyphicon-upload" aria-hidden="true"></span>
              </span>
            </div>
          </div>
          <div class="input-error"></div>`
}

export function createInputText(attributes, inputClass, params) {
  return `<div class="input-group">
          <div class="input-group-addon">
            <span class="glyphicon glyphicon-font" aria-hidden="true"></span>
            </div>
            <input type="text" ${attributes} class="${inputClass}" />
          </div>`
}

/**
 * Print form input based on input data type {Textarea | text | meta | link | image | ...}
 * && add appropriate attributs / data-attributs
 * @return {String|html} input / input group ...
 */
export function printInput (params, root) {
  params = abeExtend.hooks.instance.trigger('beforeEditorInput', params)
  var userWorkflow = (root.user != null) ? root.user.role.workflow : ''
  var res = `<div class="form-group" data-precontrib-templates="${params.precontribTemplate}">`
  var inputClass = 'form-control form-abe'
  res += getLabel(params)

  params.placeholder = params.placeholder || ''
  params.value = params.value || ''
  
  if(typeof params.value === 'string') params.value = params.value.replace(/\"/g, '&quot;')
  if(!(params.toolbar != null)) params.toolbar = '*'

  params.disabled = ''
  if (params.tab !== 'slug' && !User.utils.isUserAllowedOnRoute(userWorkflow, `/abe/operations/${params.status}/edit`)) {
    params.disabled = 'disabled="disabled"'
  }
  var attributes = getAttributes(params)

  if(params.source != null) {
    params.multiple = ((params['max-length'] == null || params['max-length'] > 1) && params.source.length > 0) ? 'multiple' : ''
    params.disabled = (params.source.length <= 0) ? 'disabled' : ''
    res += createInputSource(getAttributes(params), inputClass, params)
  }
  else if (params.type.indexOf('rich') >= 0) res += createInputRich(attributes, inputClass, params)
  else if (params.type.indexOf('file') >= 0) res += createInputFile(attributes, inputClass, params)
  else if (params.type.indexOf('textarea') >= 0) res += createInputTextarea(attributes, inputClass, params)
  else if (params.type.indexOf('link') >= 0) res += createInputLink(attributes, inputClass, params)
  else if (params.type.indexOf('image') >= 0) res += createInputImage(attributes, inputClass, params)
  else res += createInputText(attributes, inputClass, params)

  res += '</div>'
  res = abeExtend.hooks.instance.trigger('afterEditorInput', res, params)

  return res
}