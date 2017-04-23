import Handlebars from 'handlebars';
import { get as getTemplate } from 'requester';

const cachedTemplates = {};

function _get(name) {
    if (cachedTemplates[name]) {
        return Promise.resolve(cachedTemplates[name]);
    } else {
        let url = `/public/templates/${name}.handlebars`;

        return getTemplate(url)
            .then(template => {
                cachedTemplates[name] = template;
                return Promise.resolve(template);
            });
    }
}

function compile(templateName, data) {
    let result = _get(templateName)
        .then(template => {
            var templateFunction = Handlebars.compile(template);
            return templateFunction(data);
        });

    return result;
}


export { compile };