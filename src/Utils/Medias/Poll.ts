// Telestatic - Telegram MTProto framework developed based on gram.js.
// Copyright (C) 2022 Spelsinx <https://guthub.com/spelsinx>
//
// This file is part of Telestatic
//
// Telestatic is a free software : you can redistribute it and/or modify
//  it under the terms of the MIT License as published.
import { Api } from 'telegram';
import { Media } from './Media';
import { Telestatic } from '../../Client';
import Parser, { Entities } from '@tgsnake/parser';
import { Cleaning } from '../CleanObject';
const parser = new Parser(Api);
export interface IPollAnswer {
  text: string;
  chosen: boolean;
  correct: boolean;
  voters: number;
  option: string;
}
export class MediaPoll extends Media {
  id!: bigint;
  closed!: boolean;
  publicVoters!: boolean;
  multipleChoice!: boolean;
  quiz!: boolean;
  question!: string;
  answers!: Array<IPollAnswer>;
  closePeriod!: number;
  closeDate!: number;
  min!: boolean;
  totalVoters!: number;
  recentVoters!: any;
  solution?: string;
  solutionEntities?: Array<Entities>;
  constructor() {
    super();
    this['_'] = 'poll';
  }
  async encode(poll: Api.MessageMediaPoll, telestaticClient: Telestatic) {
    telestaticClient.log.debug('Creating MediaPoll');
    this.telestaticClient = telestaticClient;
    this.closed = poll.poll.closed ?? false;
    this.publicVoters = poll.poll.publicVoters ?? false;
    this.multipleChoice = poll.poll.multipleChoice ?? false;
    this.quiz = poll.poll.quiz ?? false;
    this.question = poll.poll.question;
    this.id = BigInt(String(poll.poll.id));
    this.closeDate = poll.poll.closeDate ?? 0;
    this.closePeriod = poll.poll.closePeriod ?? 0;
    this.min = poll.results.min ?? false;
    this.totalVoters = poll.results.totalVoters ?? 0;
    this.solution = poll.results.solution;
    this.solutionEntities = await parser.fromRaw(poll.results.solutionEntities ?? []);
    this.recentVoters = poll.results.recentVoters;
    let asn: Array<IPollAnswer> = [];
    for (let index in poll.poll.answers) {
      //@ts-ignore
      let answer = poll.poll.answers[index];
      //@ts-ignore
      let results = poll.results.results[index];
      if (!answer && !results) continue;
      asn.push({
        text: answer.text,
        chosen: results.chosen ?? false,
        correct: results.correct ?? false,
        voters: results.voters ?? 0,
        option: answer.option.toString('utf8'),
      });
    }
    this.answers = asn;
    await Cleaning(this);
    return this;
  }
}
