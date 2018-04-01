{{#md-form 'Gimme Dem Infos' action='#' type='post' onsubmit='return false;'}}

{{{md-input 'name' label="Enter your name:"}}}
{{{md-input 'email' type="email" label="Enter your email:" small="We will never share this information."}}}

{{{md-checkbox 'human' label="You human?"}}}

{{#md-select 'choice' label="Make a Choice:"}}
    <option value="0">Zero</option>
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
{{/md-select}}


{{{md-textarea 'bio' label="Short Bio:"}}}

{{/md-form}}