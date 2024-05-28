public class iconGenerator {
    
    private static String CHAT_GPT_KEY = System.label.ChatGPTKey; //Custom Label
    private static final String ENDPOINT ='https://api.openai.com/v1/images/generations';

    @AuraEnabled
    public static String getQueryData(String icon, String primaryColor, String secondaryColor, String shape){
        try{
            String photoUrl = '';
            Http http = new Http();
            String searchString = 'Generate an icon for '+icon+' with primary color '+ primaryColor+ ' and secondary color '+ secondaryColor + ' in '+ shape +' shape';
            String reqBody = '{"prompt": "'+searchString+'", "n": 1 ,"size" : "1024x1024", "response_format": "url", "model" : "dall-e-3"}';
            System.debug('Query '+searchString+' '+reqBody);
            HttpRequest request = new HttpRequest();
            request.setEndpoint(ENDPOINT);
            request.setMethod('POST');
            request.setHeader('Authorization', 'Bearer '+String.escapeSingleQuotes(CHAT_GPT_KEY).trim());
            //Setting timeout to 30 seconds to get whole response from Chat GPT Open API
            request.setTimeout(30000);
            request.setHeader('Content-Type', 'application/json');
            // Set the body as a JSON object
            request.setBody(reqBody);
            HttpResponse response = http.send(request);
            // Parse the JSON response
            System.debug('response is '+ response);
            if(response.getStatusCode() == 200) {
                System.debug('image data is '+ response.getBody());
                JSONParser parser = JSON.createParser(response.getBody());
                while(parser.nextToken()!=null){
                    if((parser.getCurrentToken() == JSONTOKEN.FIELD_NAME) && parser.getText() == 'url'){
                        parser.nextToken();
                        photoUrl = parser.getText();   
                        System.debug('photurl is '+photoUrl);
                    }
                }
            }
            return photoUrl;
        }catch(Exception ex){
            System.debug('Exception in Catch of Server-Side Controller '+ex);
            throw new AuraHandledException(ex.getMessage());
        }
    }

}