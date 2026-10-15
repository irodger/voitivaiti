import type {EditorKind} from '../content/laptopTools';
/** Professional editors collect existing inspected material, regardless of legacy app slot. */
export const editorEvidence:Record<EditorKind,{kinds:string[];stepTypes:string[]}>= {
 code:{kinds:[],stepTypes:[]},
 design:{kinds:['design'],stepTypes:['visual-compare']},
 research:{kinds:['task'],stepTypes:['planning','evidence-review']},
 analysis:{kinds:['metrics','network','task'],stepTypes:['metric-analysis','query-analysis','dependency-map']},
 product:{kinds:['metrics','task'],stepTypes:['metric-analysis','planning','resource-allocation']},
 planning:{kinds:['task'],stepTypes:['planning','resource-allocation','release-check']},
 support:{kinds:['task','environment'],stepTypes:['bug-reproduction']},
 architecture:{kinds:['network','task'],stepTypes:['architecture-diagram','dependency-map','planning']},
 testing:{kinds:['task','environment','design'],stepTypes:['bug-reproduction','visual-compare']}
};
