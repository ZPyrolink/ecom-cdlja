import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ILine, NewLine } from '../line.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILine for edit and NewLineFormGroupInput for create.
 */
type LineFormGroupInput = ILine | PartialWithRequiredKeyOf<NewLine>;

type LineFormDefaults = Pick<NewLine, 'id'>;

type LineFormGroupContent = {
  id: FormControl<ILine['id'] | NewLine['id']>;
  content: FormControl<ILine['content']>;
  note: FormControl<ILine['note']>;
};

export type LineFormGroup = FormGroup<LineFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LineFormService {
  createLineFormGroup(line: LineFormGroupInput = { id: null }): LineFormGroup {
    const lineRawValue = {
      ...this.getFormDefaults(),
      ...line,
    };
    return new FormGroup<LineFormGroupContent>({
      id: new FormControl(
        { value: lineRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      content: new FormControl(lineRawValue.content),
      note: new FormControl(lineRawValue.note),
    });
  }

  getLine(form: LineFormGroup): ILine | NewLine {
    return form.getRawValue() as ILine | NewLine;
  }

  resetForm(form: LineFormGroup, line: LineFormGroupInput): void {
    const lineRawValue = { ...this.getFormDefaults(), ...line };
    form.reset(
      {
        ...lineRawValue,
        id: { value: lineRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): LineFormDefaults {
    return {
      id: null,
    };
  }
}
