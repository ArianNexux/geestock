import { FormErrorMessage, FormControl, Textarea } from "@chakra-ui/react"
import LabelForm from "../LabelForm"
import { REQUIRED_FIELD } from "../../utils/constants.ts"

export default function CustomFormControlTextArea({
    errors,
    fieldNameObject,
    isDisabled,
    fieldName,
    isRequired = true,
    register,
    placeholder,
    sx={}
}){
    return (
        <FormControl isInvalid={!!errors[fieldNameObject]}>
              <LabelForm
                  title={fieldName}  
                  isRequired={isRequired}            
              />
            <Textarea  rows={4}
 sx={{width:"70%", height:"200px,", border:"1.5px solid grey", padding:"6px", borderRadius: "4px", marginTop:"15px"}} isDisabled={isDisabled} placeholder={placeholder} {...register(fieldNameObject)} />               
        <FormErrorMessage>
            {errors[fieldNameObject] && <>{REQUIRED_FIELD}</>}
        </FormErrorMessage>
            </FormControl>
    )
}