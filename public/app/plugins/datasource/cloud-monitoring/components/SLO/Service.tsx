import React, { useEffect, useState } from 'react';
import { InlineFields, Select } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';
import CloudMonitoringDatasource from '../../datasource';
import { SLOQuery } from '../../types';
import { LABEL_WIDTH } from '../../constants';

export interface Props {
  onChange: (query: SLOQuery) => void;
  query: SLOQuery;
  templateVariableOptions: Array<SelectableValue<string>>;
  datasource: CloudMonitoringDatasource;
}

export const Service: React.FC<Props> = ({ query, templateVariableOptions, onChange, datasource }) => {
  const [services, setServices] = useState<Array<SelectableValue<string>>>([]);

  useEffect(() => {
    if (!query.projectName) {
      return;
    }

    datasource.getSLOServices(query.projectName).then((services: Array<SelectableValue<string>>) => {
      setServices([
        {
          label: 'Template Variables',
          options: templateVariableOptions,
        },
        ...services,
      ]);
    });
  }, [datasource, query, templateVariableOptions]);

  return (
    <InlineFields label="Service" grow transparent labelWidth={LABEL_WIDTH}>
      <Select
        allowCustomValue
        value={{ value: query?.serviceId, label: query?.serviceName || query?.serviceId }}
        placeholder="Select service"
        options={services}
        onChange={({ value: serviceId = '', label: serviceName = '' }) =>
          onChange({ ...query, serviceId, serviceName, sloId: '' })
        }
      />
    </InlineFields>
  );
};