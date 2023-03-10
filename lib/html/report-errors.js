
import { makeEl } from './utils.js';

export default async function run (doc, opt, ctx) {
  const el = makeEl(doc);
  const details = ['errors', 'warnings']
    .filter(type => ctx[type] && ctx[type].length)
    .map(type => el('details', { class: `ipseity-${type}`}, [
      el('summary', {}, [ctx[type].length]),
      el('ol', {}, ctx[type].map(({ err, errObj }) => {
        return el('li', {}, [err, errObj ? el('pre', {}, [String(errObj)]) : '']);
      }))
    ]))
  ;
  if (!details.length) return;
  doc.body.appendChild(el('div', { id: 'ipseity-reports' }, details));
}
