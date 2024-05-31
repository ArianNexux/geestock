import { FormErrorMessage, FormControl, Input } from "@chakra-ui/react"
import LabelForm from "../LabelForm"
import { REQUIRED_FIELD } from "../../utils/constants"

export default function CustomFormControlInput({
    errors,
    fieldNameObject,
    isDisabled,
    fieldName,
    defaultValue=0,
    isRequired = true,
    register,
    placeholder,
    type,
    width="60%",
    showLabel=true
}){
    return (
        <FormControl isInvalid={!!errors[fieldNameObject]}>
              <LabelForm
                        showLabel={showLabel}
                  title={fieldName}  
                  isRequired={isRequired}            
              />
            <Input isDisabled={isDisabled} placeholder={placeholder} type={type} sx={{ width, height: "40px", border:"1.5px solid grey", borderRadius: "4px", textIndent:"5px", marginTop:"15px"}} { ...register(fieldNameObject) }/>
              
        <FormErrorMessage sx={{color:"red"}}>
            {errors[fieldNameObject] && <>{REQUIRED_FIELD}</>}
        </FormErrorMessage>
            </FormControl>
    )
}