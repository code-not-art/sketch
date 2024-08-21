// import type { Identity } from '../../types/Identity.js';
// import { Parameters } from '../../control-panel/Parameters.js';
// import type {
//   ControlPanel,
//   ControlPanelElement,
// } from '../../control-panel/types/controlPanel.js';
// import type {
//   ControlPanelParameterBaseConfig,
//   ControlPanelParameterNumber,
//   ControlPanelParameterNumberConfig,
//   ControlPanelParameterString,
//   ControlPanelParameterStringConfig,
// } from '../../control-panel/types/parameters.js';

// type ControlPanelSectionBuilder<
//   T extends Record<string, ControlPanelElement<any>> = {},
// > = {
//   get: (options: { title: string; description?: string }) => ControlPanel<T>;

//   number: <TKey extends string>(
//     key: TKey,
//     config?: Identity<
//       ControlPanelParameterNumberConfig &
//         ControlPanelParameterBaseConfig<number>
//     >,
//   ) => ControlPanelSectionBuilder<
//     T & { [K in TKey]: ControlPanelParameterNumber }
//   >;
//   string: <TKey extends string>(
//     key: TKey,
//     config?: Identity<
//       ControlPanelParameterStringConfig &
//         ControlPanelParameterBaseConfig<string>
//     >,
//   ) => ControlPanelSectionBuilder<
//     T & { [K in TKey]: ControlPanelParameterString }
//   >;
// };

// const ControlPanelSectionBuilder = (function (): ControlPanelSectionBuilder {
//   const builder = <T extends Record<string, ControlPanelElement<any>>>(
//     state = {} as T,
//   ): ControlPanelSectionBuilder<T> => {
//     const get = (options: { title: string; description?: string }) => ({
//       ...options,
//       elements: state,
//     });

//     const number = <TKey extends string>(
//       key: TKey,
//       config?: Identity<
//         ControlPanelParameterNumberConfig &
//           ControlPanelParameterBaseConfig<number>
//       >,
//     ) => {
//       const stringParam = Parameters.number(config);
//       return builder({
//         ...state,
//         ...({ key: stringParam } as {
//           [K in TKey]: ControlPanelParameterNumber;
//         }),
//       });
//     };
//     const string = <TKey extends string>(
//       key: TKey,
//       config?: Identity<
//         ControlPanelParameterStringConfig &
//           ControlPanelParameterBaseConfig<string>
//       >,
//     ) => {
//       const stringParam = Parameters.string(config);
//       return builder({
//         ...state,
//         ...({ key: stringParam } as {
//           [K in TKey]: ControlPanelParameterString;
//         }),
//       });
//     };
//     return { number, string, get };
//   };
//   return builder();
// })();

// const section = ControlPanelSectionBuilder.string('name', {
//   label: 'Some Label',
//   initialValue: '',
// })
//   .number('age', { label: 'Age?', min: 0, max: 12 })
//   .get({ title: 'sdf' });
