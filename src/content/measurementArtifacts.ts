import {text} from './localization';
import type {Problem,WorkArtifact} from '../world/types';
const key=(id:string,ru:string,en:string)=>text('measurement.'+id,ru,en);
key('title','Время ответа и контекст измерения','Response time and measurement context');
key('prompt','Открой график и сведения о том, что измеряли. Высокая линия сама по себе не объясняет обращение пользователя.','Open the chart and what was measured. A high line alone does not explain a user report.');
key('series','09:20–09:45 · время ответа','09:20–09:45 · response time');
key('series.data','Время ожидания выросло с 800 до 2400 ms в 09:30. Обращение QA появилось в 09:45.','Waiting time rose from 800 to 2400 ms at 09:30. The QA report arrived at 09:45.');
key('scope','Какой поток попал на график','Which flow the chart measures');
key('scope.data','Источник: мониторинг соседнего потока. График собирает его запросы, а не только действие из обращения QA. Это может быть отдельная проблема.','Source: monitoring of a neighboring flow. The chart aggregates its requests rather than only the action in the QA report. This may be a separate issue.');
key('compare','Сопоставить два источника','Compare two sources');
key('compare.prompt','Сравни время, действие и источник данных. Оба отчёта могут быть верными и описывать разные случаи.','Compare timing, interaction and data source. Both reports can be valid while describing different cases.');
key('qa','09:45 · конкретный случай QA','09:45 · specific QA case');
key('qa.interface','Отчёт QA: после смены ширины действие исчезает на узком экране. На широком видно. Записаны экран и последовательность, а не среднее время всех запросов.','QA report: after a width change the action disappears on narrow screens. It remains visible on wide screens. The report records a screen and sequence, not average request latency.');
key('qa.payment','Отчёт QA: повторное действие на медленной сети создаёт два результата. Один клик проходит. Это конкретная последовательность, а не среднее время всех запросов.','QA report: repeated interaction on a slow network creates two results. One click passes. This is a specific sequence, not average request latency.');
key('qa.performance','Отчёт QA: после действия с большим списком экран зависает; маленький список работает. Записаны объём и действие, а не среднее время всех запросов.','QA report: interacting with a large list stalls the screen; a small list works. The report records volume and interaction, not average request latency.');
key('qa.access','Отчёт QA: сбой зависит от состояния доступа. Записаны условия конкретного действия; общий график не разделяет эти условия.','QA report: failure depends on access state. Conditions of the specific action are recorded; the overall chart does not separate them.');
key('qa.delivery','Отчёт QA: сбой зависит от условий выпуска. Записаны версия и действие; общий график не разделяет эти условия.','QA report: failure depends on release conditions. Version and interaction are recorded; the overall chart does not separate them.');
key('unit','мс','ms');
key('scale','1000 мс — одна секунда ожидания','1000 ms is one second of waiting');
const trend=[{label:'09:20',value:800},{label:'09:25',value:800},{label:'09:30',value:2400},{label:'09:35',value:2300},{label:'09:45',value:2400}];
export function measurementArtifact():WorkArtifact{return {kind:'metrics',titleKey:'measurement.title',promptKey:'measurement.prompt',rows:[{id:'series',labelKey:'measurement.series',detailKey:'measurement.series.data',trend:structuredClone(trend)},{id:'scope',labelKey:'measurement.scope',detailKey:'measurement.scope.data'}]};}
export function crossSourceArtifact(problem:Problem):WorkArtifact{return {kind:'comparison',titleKey:'measurement.compare',promptKey:'measurement.compare.prompt',rows:[{id:'qa-source',labelKey:'measurement.qa',detailKey:'measurement.qa.'+problem.category},{id:'metrics-source',labelKey:'measurement.series',detailKey:'measurement.scope.data',trend:structuredClone(trend)}]};}
