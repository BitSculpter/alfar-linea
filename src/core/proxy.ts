import axios from "axios";
import tunnel from "tunnel";
import { z } from "zod";

import formatIntervalSec from "../utils/datetime/formatIntervalSec";
import readFileAndEncryptByLine from "../utils/file/readFileAndEncryptByLine";
import createMessage from "../utils/other/createMessage";
import getMyIp from "../utils/other/getMyIp";
import logger from "../utils/other/logger";
import sleep from "../utils/other/sleep";
import randomChoice from "../utils/random/randomChoice";

type ProxyType = "none" | "server" | "mobile";

const proxyItemSchema = z.object({
  host: z.string().ip(),
  port: z.string().transform((str) => Number(str)),
  username: z.string(),
  password: z.string(),
});

const proxySchema = z.string().transform((str) => {
  const [host, port, username, password] = str.split(":");
  return proxyItemSchema.parse({ host, port, username, password });
});

export type ProxyItem = z.infer<typeof proxySchema>;

const WAIT_AFTER_POST_REQUEST_SEC = 30;

class Proxy {
  private readonly type: ProxyType;
  private readonly isRandom?: boolean;
  private readonly ipChangeUrl?: string;
  private readonly proxyList: ProxyItem[];
  private readonly onIpChangeUrlSleepSec: number;
  private readonly onIpChangeErrorRepeatTimes: number;

  public constructor(params: {
    type: ProxyType;
    isRandom?: boolean;
    ipChangeUrl?: string;
  }) {
    const { type, isRandom, ipChangeUrl } = params;

    this.type = type;
    this.isRandom = isRandom;
    this.ipChangeUrl = ipChangeUrl;
    this.onIpChangeUrlSleepSec = 30;
    this.onIpChangeErrorRepeatTimes = 3;

    this.proxyList = [];
  }

  public async initializeProxy(fileName: string) {
    if (this.type === "none") return [];

    const allFileData = await readFileAndEncryptByLine(fileName);

    const fileData = allFileData.map((v) => v.trim()).filter(Boolean);

    const proxyList = fileData.map((proxyStr) => proxySchema.parse(proxyStr));

    switch (this.type) {
      case "mobile": {
        if (proxyList.length !== 1) {
          throw new Error(
            `only 1 proxy must be in ${fileName} for ${this.type} proxy type`,
          );
        }
        return proxyList;
      }
      case "server": {
        if (!proxyList.length) {
          throw new Error(
            `at least 1 proxy must be in ${fileName} for ${this.type} proxy type`,
          );
        }
        return proxyList;
      }
      default: {
        throw new Error(`proxy type ${this.type} is not allowed`);
      }
    }
  }

  public getHttpsTunnelByIndex(index: number) {
    if (this.type !== "server") return null;

    const proxyItem = this.isRandom
      ? randomChoice(this.proxyList)
      : this.proxyList[index];

    if (!proxyItem) {
      throw new Error(`unexpected error: no proxy on ${index} index`);
    }

    const proxy = {
      host: proxyItem.host,
      port: proxyItem.port,
      proxyAuth: `${proxyItem.username}:${proxyItem.password}`,
    };

    return tunnel.httpsOverHttp({ proxy });
  }

  public async postRequest() {
    if (this.type !== "mobile") return;

    if (!this.ipChangeUrl) {
      throw new Error(`ip change url is required for ${this.type} proxy type`);
    }

    for (let retry = 0; retry < this.onIpChangeErrorRepeatTimes; retry += 1) {
      try {
        const { status } = await axios.get(this.ipChangeUrl);

        if (status === 200) {
          const myIp = await getMyIp();

          const sleepUntilStr = formatIntervalSec(WAIT_AFTER_POST_REQUEST_SEC);

          logger.info(
            createMessage(
              `ip changed successfully: ${myIp}`,
              `sleeping until ${sleepUntilStr}`,
            ),
          );

          await sleep(WAIT_AFTER_POST_REQUEST_SEC);
        }

        throw new Error(`ip change response status is ${status}`);
      } catch (error) {
        logger.error(
          createMessage(
            `Attempt to change ip ${retry + 1} failed`,
            (error as Error).message,
          ),
        );

        await sleep(this.onIpChangeUrlSleepSec);
      }
    }

    throw new Error(
      `all ${this.onIpChangeErrorRepeatTimes} attempts to change ip failed. Please check ip change url`,
    );
  }

  public isServerRandom() {
    return this.type === "server" && !this.isRandom;
  }

  public count() {
    return this.proxyList.length;
  }
}

export default Proxy;
