import { FormErrorMessage, FormControl } from "@chakra-ui/react"
import { Controller } from "react-hook-form";
import Select from "react-select"
import LabelForm from "../LabelForm"
import { REQUIRED_FIELD } from "../../utils/constants"

export default function CustomFormControlSelect({
    errors,
    fieldNameObject,
    isDisabled,
    options,
    fieldName,
    control,
    isRequired=true,
    parent={ },
    defaultValue = false,   
    isMulti=true,
    isSearchable= false
}){
    return (
        <FormControl isInvalid={!!errors[fieldNameObject]}>
              <LabelForm
                  title={fieldName}  
                  isRequired={isRequired}            
              />
                    <Controller
                        control={control}
                        name={fieldNameObject}
                        render={({ field: { onChange, value } }) => (
                        <Select
                            id={fieldNameObject}
                            value = {value || ""}
                            options={options}      
                            placeholder="Selecionar..."
                            isSearchable={isSearchable}
                            isDisabled={isDisabled || !parent?.value}
                            onChange={(e)=>{
                                onChange(e)
                            }}
                            isMulti={isMulti}
                        />
                        )}
                    />
              
        <FormErrorMessage sx={{color:"red"}}>
          {errors[fieldNameObject] && <>{REQUIRED_FIELD}</>}
        </FormErrorMessage>
            </FormControl>
    )
}