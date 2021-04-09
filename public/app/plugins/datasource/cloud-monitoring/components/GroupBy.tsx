import React, { FunctionComponent, useMemo } from 'react';
import { SelectableValue } from '@grafana/data';
import { InlineFields, MultiSelect } from '@grafana/ui';
import { labelsToGroupedOptions } from '../functions';
import { systemLabels, LABEL_WIDTH } from '../constants';
import { Aggregations } from '.';
import { MetricDescriptor, MetricQuery } from '../types';

export interface Props {
  variableOptionGroup: SelectableValue<string>;
  labels: string[];
  metricDescriptor?: MetricDescriptor;
  onChange: (query: MetricQuery) => void;
  query: MetricQuery;
}

export const GroupBy: FunctionComponent<Props> = ({
  labels: groupBys = [],
  query,
  onChange,
  variableOptionGroup,
  metricDescriptor,
}) => {
  const options = useMemo(() => [variableOptionGroup, ...labelsToGroupedOptions([...groupBys, ...systemLabels])], [
    groupBys,
    variableOptionGroup,
  ]);

  return (
    <InlineFields
      label="Group By"
      transparent
      labelWidth={LABEL_WIDTH}
      tooltip="You can reduce the amount of data returned for a metric by combining different time series. To combine multiple time series, you can specify a grouping and a function. Grouping is done on the basis of labels. The grouping function is used to combine the time series in the group into a single time series."
    >
      <MultiSelect
        width={70}
        placeholder="Choose label"
        options={options}
        value={query.groupBys ?? []}
        onChange={(options) => {
          onChange({ ...query, groupBys: options.map((o) => o.value!) });
        }}
      ></MultiSelect>
      <Aggregations
        metricDescriptor={metricDescriptor}
        templateVariableOptions={variableOptionGroup.options}
        crossSeriesReducer={query.crossSeriesReducer}
        groupBys={query.groupBys ?? []}
        onChange={(crossSeriesReducer) => onChange({ ...query, crossSeriesReducer })}
      ></Aggregations>
    </InlineFields>
  );
};