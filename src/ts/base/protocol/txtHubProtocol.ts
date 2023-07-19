// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

import {
  CompletionMessage,
  HubMessage,
  IHubProtocol,
  InvocationMessage,
  MessageType,
  StreamItemMessage,
  ILogger,
  LogLevel,
  TransferFormat,
  NullLogger,
} from '@microsoft/signalr';
import { TxtMessageFormat } from './TxtMessageFormat';

/** Implements the Txt Hub Protocol. */
export class TxtHubProtocol implements IHubProtocol {
  /** @inheritDoc */
  public readonly name: string = 'txt';
  /** @inheritDoc */
  public readonly version: number = 1;

  /** @inheritDoc */
  public readonly transferFormat: TransferFormat = TransferFormat.Binary;

  /** Creates an array of {@link @microsoft/signalr.HubMessage} objects from the specified serialized representation.
   *
   * @param {ArrayBuffer} input A arrayBuffer containing the serialized representation.
   * @param {ILogger} logger A logger that will be used to log messages that occur during parsing.
   */
  public parseMessages(input: ArrayBuffer, logger: ILogger): HubMessage[] {
    if (!input) {
      return [];
    }

    if (logger === null) {
      logger = NullLogger.instance;
    }

    // Parse the messages
    const messages = TxtMessageFormat.parse(input);

    const hubMessages: HubMessage[] = [];
    for (const message of messages) {
      const parsedMessage = JSON.parse(message) as HubMessage;
      if (typeof parsedMessage.type !== 'number') {
        throw new Error('Invalid payload.');
      }
      switch (parsedMessage.type) {
        case MessageType.Invocation:
          this._isInvocationMessage(parsedMessage);
          break;
        case MessageType.StreamItem:
          this._isStreamItemMessage(parsedMessage);
          break;
        case MessageType.Completion:
          this._isCompletionMessage(parsedMessage);
          break;
        case MessageType.Ping:
          // Single value, no need to validate
          break;
        case MessageType.Close:
          // All optional values, no need to validate
          break;
        default:
          // Future protocol changes can add message types, old clients can ignore them
          logger.log(
            LogLevel.Information,
            "Unknown message type '" + parsedMessage.type + "' ignored.",
          );
          continue;
      }
      hubMessages.push(parsedMessage);
    }

    return hubMessages;
  }

  /** Writes the specified {@link @microsoft/signalr.HubMessage} to a string and returns it.
   *
   * @param {HubMessage} message The message to write.
   * @returns {ArrayBuffer} A arrayBuffer containing the serialized representation of the message.
   */
  public writeMessage(message: HubMessage): ArrayBuffer {
    return TxtMessageFormat.write(JSON.stringify(message));
  }

  private _isInvocationMessage(message: InvocationMessage): void {
    this._assertNotEmptyString(message.target, 'Invalid payload for Invocation message.');

    if (message.invocationId !== undefined) {
      this._assertNotEmptyString(
        message.invocationId,
        'Invalid payload for Invocation message.',
      );
    }
  }

  private _isStreamItemMessage(message: StreamItemMessage): void {
    this._assertNotEmptyString(
      message.invocationId,
      'Invalid payload for StreamItem message.',
    );

    if (message.item === undefined) {
      throw new Error('Invalid payload for StreamItem message.');
    }
  }

  private _isCompletionMessage(message: CompletionMessage): void {
    if (message.result && message.error) {
      throw new Error('Invalid payload for Completion message.');
    }

    if (!message.result && message.error) {
      this._assertNotEmptyString(
        message.error,
        'Invalid payload for Completion message.',
      );
    }

    this._assertNotEmptyString(
      message.invocationId,
      'Invalid payload for Completion message.',
    );
  }

  private _assertNotEmptyString(value: any, errorMessage: string): void {
    if (typeof value !== 'string' || value === '') {
      throw new Error(errorMessage);
    }
  }
}
