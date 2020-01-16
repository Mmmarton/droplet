import { html2json } from '@csereimarton/droplet';
import template from './box.html';

let json = html2json(template);
console.log(JSON.stringify(json));

/*----------------------------BENCHMARKS---------------------------*/
console.time('parse1');
console.timeEnd('parse1');
/*-----------------------------------------------------------------*/
