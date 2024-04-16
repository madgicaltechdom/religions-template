import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { LocalizationService } from 'src/localization/localization.service';

dotenv.config();

@Injectable()
export class askMeFlowService {
  private botId = process.env.BOT_ID;
  private apiKey = process.env.API_KEY;
  private apiUrl = process.env.API_URL;
  private baseUrl = `${this.apiUrl}/${this.botId}/messages`;

  private prepareRequestData(from: string, requestBody: string): any {
    return {
      to: from,
      type: 'text',
      text: {
        body: requestBody,
      },
    };
  }
  async sendMessage(baseUrl: string, requestData: any, token: string) {
    try {
      const response = await axios.post(baseUrl, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async sendAskMeMessage (from: string, language: string) {
    const localisedStrings = LocalizationService.getLocalisedString(language);

    const requestData = this.prepareRequestData(
      from,
      localisedStrings.askMeResponse,
    );

    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
    return response;
  };

  async sendQuestionRespone(question: string, language: string, from: string) {
    const localisedStrings = LocalizationService.getLocalisedString(language);

    const requestData = this.prepareRequestData(
      from,
      localisedStrings.questionsDefaultString,
    );

    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
    return response;
  }
}
